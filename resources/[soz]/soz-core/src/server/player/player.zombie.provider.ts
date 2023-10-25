import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { RpcServerEvent } from '../../shared/rpc';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { PlayerService } from './player.service';
import { ProgressService } from './progress.service';

@Provider()
export class PlayerZombieProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    private zombiePlayerList = new Set<string>();

    @Rpc(RpcServerEvent.PLAYER_IS_ZOMBIE)
    public isZombiePlayer(source: number): boolean {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }

        return this.zombiePlayerList.has(player.citizenid);
    }

    @OnEvent(ServerEvent.PLAYER_ZOMBIE_REMOVE)
    public async removeZombie(source: number, target: number) {
        const player = this.playerService.getPlayer(source);
        const targetPlayer = this.playerService.getPlayer(target);

        if (!player || !targetPlayer) {
            return;
        }

        if (this.zombiePlayerList.has(player.citizenid)) {
            return;
        }

        if (!this.zombiePlayerList.has(targetPlayer.citizenid)) {
            return;
        }

        const { completed } = await this.progressService.progress(source, 'analyze', 'Injection du sérum', 1000, {
            name: 'base',
            dictionary: 'amb@prop_human_bum_bin@base',
            flags: 1,
        });

        if (!completed) {
            return;
        }

        if (this.inventoryManager.removeItemFromInventory(source, 'halloween_zombie_serum', 1)) {
            this.removeZombiePlayer(target);
            this.notifier.notify(target, 'Vous vous sentez mieux...');
        } else {
            this.notifier.notify(source, "Vous n'avez plus de sérum...");
        }
    }

    @OnEvent(ServerEvent.PLAYER_ZOMBIE_CONVERT)
    public convertToZombie(source: number, target: number): void {
        const player = this.playerService.getPlayer(source);
        const targetPlayer = this.playerService.getPlayer(target);

        if (!player || !targetPlayer) {
            return;
        }

        if (this.zombiePlayerList.has(targetPlayer.citizenid)) {
            return;
        }

        if (!this.zombiePlayerList.has(player.citizenid)) {
            return;
        }

        this.addZombiePlayer(target);
    }

    public addZombiePlayer(source: number): void {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (this.zombiePlayerList.has(player.citizenid)) {
            return;
        }

        this.zombiePlayerList.add(player.citizenid);
        this.notifier.notify(player.source, 'Vous vous sentez étrange...');

        TriggerClientEvent(ClientEvent.PLAYER_ZOMBIE_TRANSFORM, source);
    }

    public removeZombiePlayer(source: number): void {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!this.zombiePlayerList.has(player.citizenid)) {
            return;
        }

        this.zombiePlayerList.delete(player.citizenid);

        TriggerClientEvent(ClientEvent.PLAYER_ZOMBIE_REMOVE, source);
    }
}
