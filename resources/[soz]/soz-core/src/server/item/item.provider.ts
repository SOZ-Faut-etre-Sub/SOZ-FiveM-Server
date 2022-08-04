import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { DrinkItem, FoodItem, InventoryItem } from '../../shared/item';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { InventoryManager } from './inventory.manager';
import { ItemService } from './item.service';

@Provider()
export class ItemProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    private canPlayerUseItem(source: number): boolean {
        if (this.playerService.getPlayerWeapon(source) !== null) {
            this.notifier.notify(source, 'Votre main est déjà occupée à porter une arme.', 'error');

            return false;
        }

        return true;
    }

    private useFoodOrDrink(source: number, item: FoodItem | DrinkItem, inventoryItem: InventoryItem): void {
        if (!this.canPlayerUseItem(source)) {
            return;
        }

        if (
            this.inventoryManager.removeItemFromInventory(
                source,
                item.name,
                1,
                inventoryItem.metadata,
                inventoryItem.slot
            )
        ) {
            TriggerClientEvent('soz-core:item:use-food-or-drink', source, item, inventoryItem);
        }
    }

    @Once()
    public onStart() {
        const foods = this.item.getItems<FoodItem>('food');

        for (const foodId of Object.keys(foods)) {
            this.item.setItemUseCallback<FoodItem>(foodId, this.useFoodOrDrink.bind(this));
        }

        const drinks = this.item.getItems<DrinkItem>('drink');

        for (const drinkId of Object.keys(drinks)) {
            this.item.setItemUseCallback<FoodItem>(drinkId, this.useFoodOrDrink.bind(this));
        }
    }
}
