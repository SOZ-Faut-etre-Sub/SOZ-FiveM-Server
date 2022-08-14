import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { DrinkItem, FoodItem, InventoryItem } from '../../shared/item';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { InventoryManager } from './inventory.manager';
import { ItemService } from './item.service';

const EXPIRED_MALUS = -5;

@Provider()
export class ItemNutritionProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private async useFoodOrDrink(
        source: number,
        item: FoodItem | DrinkItem,
        inventoryItem: InventoryItem
    ): Promise<void> {
        if (!this.item.canPlayerUseItem(source, true)) {
            return;
        }

        if (
            !this.inventoryManager.removeItemFromInventory(
                source,
                item.name,
                1,
                inventoryItem.metadata,
                inventoryItem.slot
            )
        ) {
            return;
        }

        const name = item.type === 'food' ? 'eat_something' : 'drink_something';
        const prop =
            item.type === 'food'
                ? null
                : {
                      model: 'ba_prop_club_water_bottle',
                      bone: 28422,
                      coords: { x: 0.01, y: -0.01, z: -0.06 },
                  };
        const animation =
            item.animation ||
            (item.type === 'food'
                ? {
                      dictionary: 'mp_player_inteat@burger',
                      name: 'mp_player_int_eat_burger',
                      flags: 49,
                  }
                : {
                      dictionary: 'amb@world_human_drinking@coffee@male@idle_a',
                      name: 'idle_c',
                      flags: 49,
                  });

        const { progress } = await this.progressService.progress(source, name, '', 5000, animation, {
            firstProp: prop,
        });

        const expired = this.item.isItemExpired(inventoryItem);
        const hunger = expired ? EXPIRED_MALUS : item.nutrition.hunger * progress;
        const thirst = expired ? EXPIRED_MALUS : item.nutrition.thirst * progress;
        let alcohol = expired ? item.nutrition.alcohol * 1.2 : item.nutrition.alcohol * progress;

        // Reduce alcohol if drinking a non-alcoholic drink
        if (!expired && alcohol < 0.1 && thirst > 0.1) {
            alcohol = 0 - item.nutrition.thirst * progress * 0.2;
        }

        this.playerService.incrementMetadata(source, 'hunger', hunger, 0, 100);
        this.playerService.incrementMetadata(source, 'thirst', thirst, 0, 100);
        this.playerService.incrementMetadata(source, 'alcohol', alcohol, 0, 100);

        if (isFeatureEnabled(Feature.MyBodySummer)) {
            const fiber = expired ? EXPIRED_MALUS : item.nutrition.fiber * progress;
            const sugar = expired ? EXPIRED_MALUS : item.nutrition.sugar * progress;
            const protein = expired ? EXPIRED_MALUS : item.nutrition.protein * progress;
            const lipid = expired ? EXPIRED_MALUS : item.nutrition.lipid * progress;

            this.playerService.incrementMetadata(source, 'fiber', fiber, 0, 200);
            this.playerService.incrementMetadata(source, 'sugar', sugar, 0, 200);
            this.playerService.incrementMetadata(source, 'protein', protein, 0, 200);
            this.playerService.incrementMetadata(source, 'lipid', lipid, 0, 200);
        }

        if (expired) {
            this.playerService.setPlayerDisease(source, 'intoxication');
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
