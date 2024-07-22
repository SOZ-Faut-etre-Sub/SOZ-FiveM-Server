import { InventoryFactory } from '@public/server/inventory/inventory.factory';

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { InventoryItem } from '../../shared/inventory';
import { Item } from '../../shared/item';
import { Inventory } from '../inventory/inventory';
import { PlayerService } from '../player/player.service';
import { ItemService } from './item.service';

@Provider()
export class ItemFoodProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once()
    public onStart() {
        this.item.setItemUseCallback('meal_box', this.useMealBox.bind(this));
    }

    private async useMealBox(source: number, item: Item, inventoryItem: InventoryItem, inventory: Inventory) {
        if (
            inventory.canCarryItems([
                { name: 'meal_box', amount: -1 },
                { name: 'vegan_meal', amount: 5 },
                { name: 'onigiri_assortment', amount: 5 },
                { name: 'meat_festival', amount: 5 },
                { name: 'royal_vegetables', amount: 5 },
            ])
        ) {
            inventory.removeAtSlot(inventoryItem.slot, 1);

            inventory.add('vegan_meal', 5, inventoryItem.metadata);
            inventory.add('onigiri_assortment', 5, inventoryItem.metadata);
            inventory.add('meat_festival', 5, inventoryItem.metadata);
            inventory.add('royal_vegetables', 5, inventoryItem.metadata);
        }
    }
}
