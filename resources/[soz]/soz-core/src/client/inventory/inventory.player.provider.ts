import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
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

        if (player.metadata.isdead || player.metadata.inlaststand || player.metadata.ishandcuffed) {
            return;
        }

        const playerPed = PlayerPedId();

        // Can't open inventory while playing some animations
        if (
            IsEntityPlayingAnim(playerPed, 'missminuteman_1ig_2', 'handsup_base', 3) ||
            IsEntityPlayingAnim(playerPed, 'mp_arresting', 'idle', 3)
        ) {
            return;
        }

        this.nuiMenu.closeAll();
        this.nuiDispatch.closeEverything();

        this.nuiDispatch.dispatch('inventory', 'SetOpen', !this.isOpen);
    }
}
