import { On, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { ServerStateService } from '@public/server/server.state.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { BedLocations } from '@public/shared/job/lsmc';
import { PlayerData, PlayerMetadata } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';

import { PlayerStateService } from '../../player/player.state.service';

@Provider()
export class LSMCDeathProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    private occupiedBeds: Record<number, number> = {};

    // Map the source id of the player dead and everyone that has been notified so that we can
    // inform them he has been revived even if they are not on duty anymore
    private playersNotifiedDeath: Map<number, number[]> = new Map();

    @OnEvent(ServerEvent.LSMC_REVIVE)
    public async revive(source: number, targetid: number, admin: boolean, uniteHU: boolean, bloodbag: boolean) {
        if (!targetid) {
            targetid = source;
        }

        if (!admin && !uniteHU) {
            if (!this.inventoryManager.removeNotExpiredItem(source, bloodbag ? 'bloodbag' : 'defibrillator')) {
                return;
            }

            if (bloodbag) {
                this.inventoryManager.addItemToInventory(source, 'used_bloodbag');
            }
        }

        const player = this.playerService.getPlayer(targetid);
        let uniteHUBed = -1;

        const datas = {} as Partial<PlayerMetadata>;

        if (uniteHU) {
            uniteHUBed = this.getFreeBed(source);
            this.playerStateService.setClientState(targetid, {
                isWearingPatientOutfit: true,
            });
            datas.inside = player.metadata.inside;
            datas.inside.apartment = false;
            datas.inside.property = null;
        }

        if (player.metadata.mort) {
            this.notifier.notify(source, player.metadata.mort, 'success', 30000);
        }
        if (player.metadata.drug >= 100) {
            this.notifier.notify(source, 'Cette personne a subit une overdose de drogue.', 'success', 30000);
        }

        TriggerClientEvent(ClientEvent.LSMC_REVIVE, player.source, admin, uniteHU, uniteHUBed);

        datas.hunger = this.playerService.getIncrementedMetadata(player, 'hunger', 30, 0, 100);
        datas.thirst = this.playerService.getIncrementedMetadata(player, 'thirst', 30, 0, 100);
        datas.alcohol = this.playerService.getIncrementedMetadata(player, 'alcohol', -50, 0, 100);
        datas.drug = this.playerService.getIncrementedMetadata(player, 'drug', -50, 0, 110);
        datas.isdead = false;
        datas.mort = '';

        this.playerService.setPlayerMetaDatas(targetid, datas);

        this.playerStateService.setClientState(targetid, {
            isDead: false,
        });

        this.endUrgency(targetid);
    }

    public getFreeBed(source: number): number {
        for (let i = 0; i < BedLocations.length; i++) {
            if (!this.occupiedBeds[i]) {
                this.occupiedBeds[i] = source;
                return i;
            }
        }
        return -1;
    }

    @On('playerDropped')
    @OnEvent(ServerEvent.LSMC_FREE_BED)
    public freeBed(source: number) {
        for (let i = 0; i < BedLocations.length; i++) {
            if (this.occupiedBeds[i] == source) {
                delete this.occupiedBeds[i];
            }
        }
    }

    @OnEvent(ServerEvent.LSMC_ON_DEATH)
    public onDeath(source: number) {
        this.playerService.setPlayerMetadata(source, 'isdead', true);

        this.playerStateService.setClientState(source, {
            isDead: true,
        });
    }

    public applyOnEachPlayerOnDuty(functionToApply: (player: PlayerData) => void) {
        const players = this.serverStateService.getPlayers();
        for (const player of players) {
            if (player.job.id == JobType.LSMC && player.job.onduty) {
                functionToApply(player);
            }
        }
    }

    @OnEvent(ServerEvent.LSMC_SET_DEATH_REASON)
    public deathReason(source: number, reason: string) {
        const deathDescription = reason ? reason : '';
        this.playerService.setPlayerMetadata(source, 'mort', deathDescription);
        this.monitor.publish('player_dead', { player_source: source }, { reason: deathDescription });
    }

    @OnEvent(ServerEvent.LSMC_NEW_URGENCY)
    public newUrgency(source: number) {
        const playersAlerted = [];
        const coords = GetEntityCoords(GetPlayerPed(source)) as Vector3;
        this.applyOnEachPlayerOnDuty(function (playerData) {
            TriggerLatentClientEvent(ClientEvent.LSMC_NEW_URGENCY, playerData.source, 16 * 1024, source, coords);
            playersAlerted.push(playerData.source);
        });
        this.playersNotifiedDeath.set(source, playersAlerted);
    }

    @OnEvent(ServerEvent.QBCORE_SET_DUTY, false)
    public onToggleDuty(jobid: JobType, onDuty: boolean, source: number) {
        if (jobid != JobType.LSMC) {
            return;
        }
        const allPlayersCurrentlyDeaths = this.playersNotifiedDeath.keys();
        if (onDuty) {
            for (const playerDead of allPlayersCurrentlyDeaths) {
                const coords = GetEntityCoords(GetPlayerPed(playerDead)) as Vector3;
                TriggerLatentClientEvent(ClientEvent.LSMC_NEW_URGENCY, source, 16 * 1024, playerDead, coords);
                this.playersNotifiedDeath.get(playerDead).push(source);
            }
        } else {
            for (const playerDead of allPlayersCurrentlyDeaths) {
                TriggerLatentClientEvent(ClientEvent.LSMC_END_URGENCY, source, 16 * 1024, playerDead);
                const list = this.playersNotifiedDeath.get(playerDead);
                const index = list.indexOf(source, 0);
                if (index > -1) {
                    list.splice(index, 1);
                }
            }
        }
    }

    @On('playerDropped')
    public endUrgency(source: number) {
        const playersAlerted = this.playersNotifiedDeath.get(source);
        if (playersAlerted) {
            playersAlerted.forEach(player => TriggerClientEvent(ClientEvent.LSMC_END_URGENCY, player, source));
        }
        this.playersNotifiedDeath.delete(source);
    }
}
