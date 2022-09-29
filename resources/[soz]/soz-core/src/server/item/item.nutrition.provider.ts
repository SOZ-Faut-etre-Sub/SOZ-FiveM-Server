import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { CocktailItem, DrinkItem, FoodItem, InventoryItem, LiquorItem } from '../../shared/item';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { InventoryManager } from './inventory.manager';
import { ItemService } from './item.service';

const INTOXICATED_MALUS = -5;
const INTOXICATED_NUTRITION_MALUS = -2;

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

    private lastItemEatByPlayer: Record<string, string> = {};

    private async useFoodOrDrink(
        source: number,
        item: FoodItem | DrinkItem | CocktailItem | LiquorItem,
        inventoryItem: InventoryItem
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

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
                ? item.name === 'zevent2022_popcorn'
                    ? {
                          model: 'xs_prop_trinket_cup_01a',
                          bone: 60309,
                          coords: { x: 0.14, y: 0.01, z: -0.01 },
                          rotation: { x: 0.01, y: -90.01, z: 0.01 },
                      }
                    : {
                          model: 'prop_cs_burger_01',
                          bone: 60309,
                          coords: { x: 0.01, y: -0.01, z: -0.06 },
                      }
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

        let intoxicatedLuck = 2.0;

        if (isFeatureEnabled(Feature.MyBodySummer)) {
            if (this.lastItemEatByPlayer[player.citizenid] === item.name) {
                intoxicatedLuck = 20.0;
            }

            const totalPercent =
                player.metadata.sugar +
                player.metadata.fiber +
                player.metadata.lipid +
                player.metadata.protein +
                item.nutrition.sugar +
                item.nutrition.fiber +
                item.nutrition.lipid +
                item.nutrition.protein;

            const diffPercent = totalPercent - 100;

            if (diffPercent > 0) {
                intoxicatedLuck += Math.floor(diffPercent / 2);
            }
        }

        const intoxicated = Math.random() * 100 <= intoxicatedLuck || this.item.isItemExpired(inventoryItem);
        const hunger = intoxicated ? INTOXICATED_MALUS : item.nutrition.hunger * progress;
        const thirst = intoxicated ? INTOXICATED_MALUS : item.nutrition.thirst * progress;
        let alcohol = intoxicated ? item.nutrition.alcohol * 1.2 : item.nutrition.alcohol * progress;

        // Reduce alcohol if drinking a non-alcoholic drink
        if (!intoxicated && alcohol < 0.1 && thirst > 0.1) {
            alcohol = 0 - item.nutrition.thirst * progress * 0.2;
        }

        this.playerService.incrementMetadata(source, 'hunger', hunger, 0, 100);
        this.playerService.incrementMetadata(source, 'thirst', thirst, 0, 100);
        this.playerService.incrementMetadata(source, 'alcohol', alcohol, 0, 100);

        if (isFeatureEnabled(Feature.MyBodySummer)) {
            const fiber = intoxicated ? INTOXICATED_NUTRITION_MALUS : item.nutrition.fiber * progress;
            const sugar = intoxicated ? INTOXICATED_NUTRITION_MALUS : item.nutrition.sugar * progress;
            const protein = intoxicated ? INTOXICATED_NUTRITION_MALUS : item.nutrition.protein * progress;
            const lipid = intoxicated ? INTOXICATED_NUTRITION_MALUS : item.nutrition.lipid * progress;

            this.playerService.incrementMetadata(source, 'fiber', fiber, 0, 25);
            this.playerService.incrementMetadata(source, 'sugar', sugar, 0, 25);
            this.playerService.incrementMetadata(source, 'protein', protein, 0, 25);
            this.playerService.incrementMetadata(source, 'lipid', lipid, 0, 25);
            const newHealthLevel = this.playerService.incrementMetadata(
                source,
                'health_level',
                fiber + sugar + protein + lipid,
                0,
                100
            );

            if (newHealthLevel !== null) {
                let maxHealth = 200;

                if (newHealthLevel < 20) {
                    maxHealth = 120;
                } else if (newHealthLevel < 40) {
                    maxHealth = 160;
                }

                this.playerService.setPlayerMetadata(source, 'max_health', maxHealth);
            }
        }

        if (intoxicated) {
            this.playerService.setPlayerDisease(source, 'intoxication');
        }

        this.lastItemEatByPlayer[player.citizenid] = item.name;
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

        const cocktails = this.item.getItems<CocktailItem>('cocktail');

        for (const cocktailId of Object.keys(cocktails)) {
            this.item.setItemUseCallback<CocktailItem>(cocktailId, this.useFoodOrDrink.bind(this));
        }

        const liquors = this.item.getItems<CocktailItem>('liquor');

        for (const liquorId of Object.keys(liquors)) {
            this.item.setItemUseCallback<LiquorItem>(liquorId, this.useFoodOrDrink.bind(this));
        }
    }
}
