import { Command } from '../../core/decorators/command';
import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { InventoryManager } from './inventory.manager';

@Provider()
export class InventoryPlayerProvider {
    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private isOpen = false;

    private isLocked: Set<string> = new Set();

    @OnNuiEvent(NuiEvent.InventoryOpenPlayerInventory)
    public async onOpenPlayerInventory({ isOpen }: { isOpen: boolean }) {
        this.isOpen = isOpen;
    }

    @OnNuiEvent(NuiEvent.InventoryGoBackPlayerInventory)
    public async onGoBackPlayerInventory() {
        this.openPlayerInventory();
    }

    @OnEvent(ClientEvent.INVENTORY_LOCK)
    public async onLockInventory(lock: boolean, reason: string) {
        if (lock) {
            this.isLocked.add(reason);
        } else {
            this.isLocked.delete(reason);
        }

        if (lock) {
            this.nuiDispatch.closeEverything();
        }
    }

    @Command('inventory', {
        description: "Ouvrir l'inventaire",
        passthroughNuiFocus: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'F2',
            },
        ],
    })
    public openPlayerInventory() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (
            player.metadata.isdead ||
            player.metadata.inlaststand ||
            player.metadata.ishandcuffed ||
            this.isLocked.size > 0
        ) {
            return;
        }

        this.nuiMenu.closeAll();
        this.nuiDispatch.closeEverything();

        this.nuiDispatch.dispatch('inventory', 'SetOpen', !this.isOpen);
    }
}
