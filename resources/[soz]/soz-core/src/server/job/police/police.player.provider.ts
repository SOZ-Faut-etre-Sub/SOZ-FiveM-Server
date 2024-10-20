import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { PlayerService } from '@public/server/player/player.service';
import { PlayerStateService } from '@public/server/player/player.state.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';

import { Vector3 } from '../../../shared/polyzone/vector';
import { Monitor } from '../../monitor/monitor';

@Provider()
export class PolicePlayerProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.CUFF_PLAYER)
    public async onCuffPlayer(source: number, targetId: number) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (target) {
            if (inventory.remove('handcuffs', 1)) {
                this.playerService.setPlayerMetadata(target.source, 'ishandcuffed', true);
                this.playerStateService.setClientState(target.source, { isHandcuffed: true });

                TriggerClientEvent(ClientEvent.POLICE_HANDCUFF_ANIMATION, player.source);
                TriggerClientEvent(ClientEvent.POLICE_GET_CUFFED, target.source, player.source);
                TriggerClientEvent(ClientEvent.INVENTORY_LOCK, target.source, true, 'cuffed');
                TriggerClientEvent('soz-talk:client:PowerOffRadio', target.source);

                this.monitor.traceEvent('job_police_cuff_player', {
                    player_source: player.source,
                    target_source: target.source,
                    position: GetEntityCoords(GetPlayerPed(player.source)) as Vector3,
                });
            } else {
                TriggerClientEvent(ClientEvent.NOTIFICATION_DRAW, source, "Vous n'avez pas de ~r~menottes", 'error');
            }
        }
    }

    @OnEvent(ServerEvent.UNCUFF_PLAYER)
    public async onUncuffPlayer(source: number, targetId: number) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (target) {
            if (inventory.remove('handcuffs_key', 1)) {
                TriggerClientEvent(ClientEvent.POLICE_UNCUFF_ANIMATION, player.source);
                await wait(3000);

                this.playerService.setPlayerMetadata(target.source, 'ishandcuffed', false);
                this.playerStateService.setClientState(target.source, { isHandcuffed: false });
                TriggerClientEvent(ClientEvent.POLICE_GET_UNCUFFED, target.source);
                TriggerClientEvent(ClientEvent.INVENTORY_LOCK, target.source, false, 'cuffed');
                TriggerClientEvent('soz-talk:client:PowerOnRadio', target.source);

                this.monitor.traceEvent('job_police_uncuff_player', {
                    player_source: player.source,
                    target_source: target.source,
                    position: GetEntityCoords(GetPlayerPed(target.source)) as Vector3,
                });
            } else {
                TriggerClientEvent(
                    ClientEvent.NOTIFICATION_DRAW,
                    source,
                    "Vous n'avez pas de ~r~clé de menottes",
                    'error'
                );
            }
        }
    }

    @OnEvent(ServerEvent.ESCORT_PLAYER)
    public onEscortPlayer(source: number, targetId: number, crimi: boolean) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (player && target && player != target) {
            this.playerStateService.setClientState(target.source, { isEscorted: true });
            this.playerStateService.setClientState(player.source, { isEscorting: true, escorting: target.source });

            TriggerClientEvent(ClientEvent.SET_ESCORTING, player.source, target.source, crimi);
            TriggerClientEvent(ClientEvent.GET_ESCORTED, target.source, player.source, crimi);

            this.monitor.traceEvent('job_police_escort_player', {
                player_source: player.source,
                target_source: target.source,
                criminal_state: crimi ? 1 : 0,
                position: GetEntityCoords(GetPlayerPed(target.source)) as Vector3,
            });
        }
    }

    @OnEvent(ServerEvent.REMOVE_ESCORT_PLAYER)
    public onUnescortPlayer(source: number, targetId: number) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (player && target && player != target) {
            this.playerStateService.setClientState(target.source, { isEscorted: false });
            this.playerStateService.setClientState(player.source, { isEscorting: false, escorting: null });
            TriggerClientEvent(ClientEvent.REMOVE_ESCORTED, target.source);

            this.monitor.traceEvent('job_police_deescort_player', {
                player_source: player.source,
                target_source: target.source,
                position: GetEntityCoords(GetPlayerPed(target.source)) as Vector3,
            });
        }
    }
}
