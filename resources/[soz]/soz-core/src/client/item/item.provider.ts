import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { DrinkItem, FoodItem, InventoryItem } from '../../shared/item';
import { ProgressService } from '../progress.service';
import { ItemService } from './item.service';

@Provider()
export class ItemProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @On('soz-core:item:use-food-or-drink')
    public async useFoodOrDrink(item: FoodItem | DrinkItem, itemInventory: InventoryItem) {
        const name = item.type === 'food' ? 'eat_something' : 'drink_something';
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

        const { completed, progress } = await this.progressService.progress(name, '', 5000, animation);

        if (completed) {
        }
    }
}
