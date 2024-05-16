import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { InventoryItem, Item } from '../../shared/item';
import { InventoryManager } from '../inventory/inventory.manager';
import { PlayerService } from '../player/player.service';
import { ItemService } from './item.service';

@Provider()
export class ItemFoodProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once()
    public onStart() {
        this.item.setItemUseCallback('meal_box', this.useMealBox.bind(this));
    }

    private useMealBox(source: number, item: Item, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (
            this.inventoryManager.canCarryItems(source, [
                { name: 'meal_box', amount: -1 },
                { name: 'vegan_meal', amount: 5 },
                { name: 'onigiri_assortment', amount: 5 },
                { name: 'meat_festival', amount: 5 },
                { name: 'royal_vegetables', amount: 5 },
            ])
        ) {
            this.inventoryManager.removeInventoryItem(source, inventoryItem);

            this.inventoryManager.addItemToInventory(source, 'vegan_meal', 5, inventoryItem.metadata);
            this.inventoryManager.addItemToInventory(source, 'onigiri_assortment', 5, inventoryItem.metadata);
            this.inventoryManager.addItemToInventory(source, 'meat_festival', 5, inventoryItem.metadata);
            this.inventoryManager.addItemToInventory(source, 'royal_vegetables', 5, inventoryItem.metadata);
        }
    }
}
