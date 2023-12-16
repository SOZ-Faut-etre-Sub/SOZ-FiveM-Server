import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { PlayerService } from '@public/server/player/player.service';
import { PlayerStateService } from '@public/server/player/player.state.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';

@Provider()
export class PolicePlayerProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @OnEvent(ServerEvent.CUFF_PLAYER)
    public onCuffPlayer(source: number, targetId: number) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (target) {
            const handcuffs = this.inventoryManager.findItem(player.source, item => item.name == 'handcuffs');
            if (handcuffs) {
                this.inventoryManager.removeInventoryItem(player.source, handcuffs, 1);
                this.playerService.setPlayerMetadata(target.source, 'ishandcuffed', true);
                this.playerStateService.setClientState(target.source, { isHandcuffed: true });

                TriggerClientEvent(ClientEvent.POLICE_HANDCUFF_ANIMATION, player.source);
                TriggerClientEvent(ClientEvent.POLICE_GET_CUFFED, target.source, player.source);
                TriggerClientEvent('soz-talk:client:PowerOffRadio', target.source);
            } else {
                TriggerClientEvent(ClientEvent.NOTIFICATION_DRAW, source, "Vous n'avez pas de ~r~menottes", 'error');
            }
        }
    }

    @OnEvent(ServerEvent.UNCUFF_PLAYER)
    public async onUncuffPlayer(source: number, targetId: number) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (target) {
            const handcuffs_key = this.inventoryManager.findItem(player.source, item => item.name == 'handcuffs_key');
            if (handcuffs_key) {
                this.inventoryManager.removeInventoryItem(player.source, handcuffs_key, 1);
                TriggerClientEvent(ClientEvent.POLICE_UNCUFF_ANIMATION, player.source);
                await wait(3000);

                this.playerService.setPlayerMetadata(target.source, 'ishandcuffed', false);
                this.playerStateService.setClientState(target.source, { isHandcuffed: false });
                TriggerClientEvent(ClientEvent.POLICE_GET_UNCUFFED, target.source);
                TriggerClientEvent('soz-talk:client:PowerOnRadio', target.source);
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
    public onEscortPlayer(source: number, targetId: number, crimi: number) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (player && target && player != target) {
            this.playerStateService.setClientState(target.source, { isEscorted: true });
            this.playerStateService.setClientState(player.source, { isEscorting: true, escorting: target.source });

            TriggerClientEvent(ClientEvent.SET_ESCORTING, player.source, target.source, crimi);
            TriggerClientEvent(ClientEvent.GET_ESCORTED, target.source, player.source, crimi);
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
        }
    }
}
