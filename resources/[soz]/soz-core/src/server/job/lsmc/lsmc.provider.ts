import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { PlayerInjuryProvider } from '@private/server/player/player.injuries.provider';
import { Command } from '@public/core/decorators/command';
import { OnEvent } from '@public/core/decorators/event';
import { Rpc } from '@public/core/decorators/rpc';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { PlayerStateService } from '@public/server/player/player.state.service';
import { Organ } from '@public/shared/disease';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { Monitor } from '../../monitor/monitor';
import { LSMCDamageProvider } from './lsmc.damage.provider';

@Provider()
export class LSMCProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerInjuryProvider)
    private playerInjuryProvider: PlayerInjuryProvider;

    @Inject(LSMCDamageProvider)
    private LSMCDamageProvider: LSMCDamageProvider;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Rpc(RpcServerEvent.LSMC_CAN_REMOVE_ITT)
    public canRemoveITT(source: number, target: number) {
        const player = this.playerService.getPlayer(target);

        if (!player) {
            return false;
        }

        const state = this.playerStateService.getClientState(target);

        if (state.isDead) {
            return false;
        }

        return player.metadata.itt;
    }

    @Rpc(RpcServerEvent.LSMC_CAN_SET_ITT)
    public canSetITT(source: number, target: number) {
        const player = this.playerService.getPlayer(target);

        if (!player) {
            return false;
        }

        const state = this.playerStateService.getClientState(target);

        if (state.isDead) {
            return false;
        }

        return !player.metadata.itt;
    }

    @OnEvent(ServerEvent.LSMC_SET_PATIENT_OUTFIT)
    public setPatientOutfit(source: number, target: number, useOutfit: boolean) {
        const player = this.playerService.getPlayer(target);
        if (!player) {
            return;
        }

        this.playerStateService.setClientState(player.source, {
            isWearingPatientOutfit: useOutfit,
        });

        if (useOutfit) {
            TriggerClientEvent(ClientEvent.LSMC_APPLY_PATIENT_CLOTHING, player.source);
        } else {
            TriggerClientEvent(ClientEvent.LSMC_REMOVE_PATIENT_CLOTHING, player.source);
        }
    }

    @OnEvent(ServerEvent.LSMC_HEAL)
    public async onHeal(source: number, id: number) {
        const player = this.playerService.getPlayer(id);

        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.remove('firstaid', 1, false)) {
            return;
        }

        if (player.metadata.disease == 'grippe') {
            this.playerService.setPlayerDisease(player.source, false);
            this.notifier.notify(player.source, 'Vous êtes guéri!');
        }

        this.LSMCDamageProvider.removeDamages(player.source);

        const target = this.playerService.getPlayer(id);

        this.monitor.traceEvent('job_lsmc_heal', {
            player_source: source,
            target_source: id,
            before_health: target?.metadata.health,
            position: GetEntityCoords(GetPlayerPed(player.source)) as Vector3,
        });

        TriggerClientEvent(ClientEvent.LSMC_HEAL, player.source, 100);
    }

    @OnEvent(ServerEvent.LSMC_GIVE_BLOOD)
    public async onGiveBlood(source: number, id: number) {
        const player = this.playerService.getPlayer(id);

        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.remove('empty_bloodbag', 1, false)) {
            return;
        }

        inventory.add('bloodbag');

        this.playerService.setPlayerMetaDatas(id, {
            hunger: player.metadata.hunger - 20,
            thirst: player.metadata.thirst - 20,
        });

        this.notifier.notify(player.source, 'Vous avez ~g~donné~s~ votre sang !');
    }

    @OnEvent(ServerEvent.LSMC_TELEPORTATION)
    public onTeleportation(source: number, id: number, coords: Vector3) {
        TriggerClientEvent(ClientEvent.LSMC_TELEPORTATION, id, coords);
    }

    @OnEvent(ServerEvent.LSMC_TOOGLE_ITT)
    public onToogleITT(source: number, id: number, duration: number) {
        const player = this.playerService.getPlayer(id);

        if (!player) {
            return;
        }

        const itt = player.metadata.itt;

        if (itt) {
            this.playerService.setPlayerMetadata(id, 'itt', false);
            this.notifier.notify(id, 'Vous pouvez reprendre le travail');
            if (source != id) {
                this.notifier.notify(source, "Vous avez enlevé l'interdiction de travail temporaire");
            }
        } else {
            if (player.job.onduty) {
                this.playerService.setJobDuty(id, false);
                this.notifier.notify(id, 'Vous êtes hors service', 'info');
            }

            this.playerService.setPlayerMetadata(id, 'itt', true);
            this.playerService.setPlayerMetadata(id, 'itt_end', Date.now() + duration);
            this.notifier.notify(id, 'Vous avez été mis en interdiction de travail temporaire');
            this.notifier.notify(source, 'Vous avez mis la personne en interdiction de travail temporaire');
        }
    }

    @Command('toggleitt', { role: ['staff', 'admin'], description: 'toogle itt for myself' })
    async toggleItt(source: number) {
        this.onToogleITT(source, source, 0);
    }

    @OnEvent(ServerEvent.LSMC_SET_CURRENT_ORGAN)
    public async onSetCurrentOrgan(source: number, organ: Organ | null, id: number) {
        id = id || source;
        const player = this.playerService.getPlayer(id);

        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!organ && player.metadata.organ) {
            if (!inventory.remove(player.metadata.organ, 1, false)) {
                return;
            }
        } else {
            if (!inventory.canCarryItem('expired_organ', 1)) {
                this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                return;
            }
        }

        this.playerService.setPlayerMetadata(id, 'organ', organ);

        if (organ) {
            const item = this.itemService.getItem(organ as string);
            inventory.add('expired_organ', 1);
            this.notifier.notify(source, `Vous avez retiré un ${item.label}`, 'success');
        }
    }

    @OnEvent(ServerEvent.LSMC_SET_HAZMAT)
    public onSetHazmat(source: number, hazmat: boolean) {
        this.playerService.setPlayerMetadata(source, 'hazmat', hazmat);
    }

    @Rpc(RpcServerEvent.LSMC_GET_CURRENT_ORGAN)
    public onGetCurrentOrgan(source: number, id: number): Organ | null {
        const player = this.playerService.getPlayer(id);

        if (!player) {
            return;
        }

        return player.metadata.organ;
    }

    @OnEvent(ServerEvent.LSMC_BED_PUT_ON)
    public onPutOnBed(source: number, model: number, coords: Vector3) {
        const playerState = this.playerStateService.getClientState(source);
        if (!playerState || !playerState.isEscorting || !playerState.escorting) {
            return;
        }

        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(playerState.escorting);

        if (player && target && player != target) {
            this.playerStateService.setClientState(target.source, { isEscorted: false });
            this.playerStateService.setClientState(player.source, { isEscorting: false, escorting: null });
            TriggerClientEvent(ClientEvent.LSMC_BED_PUT_ON, target.source, model, coords);
        }
    }

    @OnEvent(ServerEvent.LSMC_VEH_PUT_ON)
    public onPutOnVeh(source: number, netId: number) {
        const playerState = this.playerStateService.getClientState(source);
        if (!playerState || !playerState.isEscorting || !playerState.escorting) {
            return;
        }

        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(playerState.escorting);

        if (player && target && player != target) {
            this.playerStateService.setClientState(target.source, { isEscorted: false });
            this.playerStateService.setClientState(player.source, { isEscorting: false, escorting: null });
            TriggerClientEvent(ClientEvent.LSMC_VEH_PUT_ON, target.source, netId);
        }
    }
}
