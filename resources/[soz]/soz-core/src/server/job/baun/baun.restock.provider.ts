import { InventoryFactory } from '@public/server/inventory/inventory.factory';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { ItemService } from '../../item/item.service';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';

export const RESTOCK_CONFIG: Record<string, { name: string; amount: number }[]> = {
    liquor_crate: [
        { name: 'vodka', amount: 2 },
        { name: 'gin', amount: 2 },
        { name: 'tequila', amount: 2 },
        { name: 'whisky', amount: 2 },
        { name: 'cognac', amount: 2 },
        { name: 'rhum', amount: 2 },
    ],
    flavor_crate: [
        { name: 'green_lemon', amount: 5 },
        { name: 'cane_sugar', amount: 10 },
        { name: 'ananas_juice', amount: 5 },
        { name: 'coconut_milk', amount: 5 },
        { name: 'strawberry_juice', amount: 5 },
        { name: 'orange_juice', amount: 5 },
        { name: 'apple_juice', amount: 5 },
    ],
    furniture_crate: [
        { name: 'straw', amount: 10 },
        { name: 'fruit_slice', amount: 12 },
        { name: 'tumbler', amount: 10 },
    ],
    snack_crate: [
        { name: 'tapas', amount: 10 },
        { name: 'peanuts', amount: 10 },
        { name: 'olives', amount: 10 },
    ],
    beer_crate: [
        { name: 'beer_crown', amount: 4 },
        { name: 'beer_chiliad_ipa', amount: 4 },
        { name: 'beer_paleto_wheat', amount: 4 },
        { name: 'beer_captus', amount: 4 },
        { name: 'beer_kuro', amount: 4 },
        { name: 'beer_sunkiss', amount: 4 },
    ],
};

@Provider()
export class BaunRestockProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ItemService)
    private itemService: ItemService;

    @OnEvent(ServerEvent.BAUN_RESTOCK)
    public async onRestock(source: number, storage: string, item: string) {
        const config = RESTOCK_CONFIG[item];

        if (!config) {
            return;
        }

        const itemData = this.itemService.getItem(item);
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.hasEnoughItem(item, 1, true)) {
            this.notifier.notify(source, `Vous n'avez pas de ${itemData.label}.`, 'error');

            return;
        }

        const targetInventory = await this.inventoryFactory.get(storage);

        while (inventory.hasEnoughItem(item, 1, true)) {
            const { completed } = await this.progressService.progress(
                source,
                'restock',
                'Vous commencez à restocker.',
                4000,
                {
                    dictionary: 'rcmextreme3',
                    name: 'idle',
                    options: {
                        repeat: true,
                    },
                },
                {
                    disableMovement: true,
                    disableCarMovement: true,
                    disableMouse: false,
                    disableCombat: true,
                }
            );

            if (!completed) {
                break;
            }

            if (!inventory.hasEnoughItem(item, 1, true)) {
                break;
            }

            if (!targetInventory.canCarryItems(config)) {
                this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');

                break;
            }

            if (!inventory.remove(item, 1, false)) {
                break;
            }

            for (const { name, amount } of config) {
                targetInventory.add(name, amount);
            }
        }

        this.notifier.notify(source, `Vous avez arrêté de restocker ${itemData.label}.`, 'success');
    }
}
