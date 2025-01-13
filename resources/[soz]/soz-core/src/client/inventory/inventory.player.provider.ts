import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent } from '../../shared/event/nui';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { ClothingShopProvider } from '../shop/cloth.shop.provider';
import { Election2024CeremonyProvider } from '../story/election-2024/ceremony.provider';
import { ParadeProvider } from '../story/parade.provider';
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

    @Inject(ClothingShopProvider)
    private clothingShopProvider: ClothingShopProvider;

    @Inject(Election2024CeremonyProvider)
    private ceremonyProvider: Election2024CeremonyProvider;

    @Inject(ParadeProvider)
    private paradeProvider: ParadeProvider;

    private isOpen = false;

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

        if (!this.isOpen) {
            if (player.metadata.isdead || player.metadata.inlaststand || player.metadata.ishandcuffed) {
                return;
            }

            if (this.ceremonyProvider.isRunning) {
                return;
            }

            if (this.paradeProvider.isRunning) {
                return;
            }

            if (this.clothingShopProvider.isInShop()) {
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
        }

        this.nuiMenu.closeAll();
        this.nuiDispatch.closeEverything();

        this.nuiDispatch.dispatch('inventory', 'SetOpen', !this.isOpen);
    }
}
