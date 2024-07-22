import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ItemService } from '@public/server/item/item.service';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { ADD_ERROR_MESSAGE, InventoryItem, isInventoryItemExpired } from '../../../shared/inventory';
import { Notifier } from '../../notifier';

@Provider()
export class BaunCraftProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ItemService)
    private item: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private itemService: ItemService;

    @OnEvent(ServerEvent.BAUN_CREATE_COCKTAIL_BOX)
    public async craftCocktailBox(source: number) {
        let remaining = 10;

        const toRemove: { item: InventoryItem; amount: number }[] = [];
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        for (const inventoryItem of Object.values(inventory.items())) {
            if (inventoryItem.type !== 'cocktail') {
                continue;
            }

            if (inventoryItem.amount <= 0) {
                continue;
            }

            if (isInventoryItemExpired(inventoryItem)) {
                continue;
            }

            const removeAmount = Math.min(inventoryItem.amount, remaining);
            remaining -= removeAmount;

            toRemove.push({
                item: inventoryItem,
                amount: removeAmount,
            });

            if (remaining <= 0) {
                break;
            }
        }

        if (remaining > 0) {
            this.notifier.notify(source, `Vous devez avoir au moins 10 cocktails pour créer une caisse.`, 'error');

            return;
        }

        if (
            !inventory.canSwapItems(
                toRemove.map(remove => {
                    return {
                        name: remove.item.name,
                        amount: remove.amount,
                        metadata: remove.item.metadata,
                    };
                }),
                [
                    {
                        name: 'cocktail_box',
                        amount: 1,
                        metadata: {},
                    },
                ]
            )
        ) {
            this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');

            return;
        }

        for (const remove of toRemove) {
            inventory.removeAtSlot(remove.item.slot, remove.amount);
        }

        inventory.add('cocktail_box', 1);

        this.notifier.notify(source, `Vous avez créé un assortiment de cocktails.`, 'success');
    }

    @OnEvent(ServerEvent.BAUN_ICE_CUBE)
    public async onIceCube(source: number, count: number) {
        if (!count) {
            this.notifier.notify(source, 'Une erreur est survenue lors du choix de la quantité.', 'error');
            return;
        }

        const iceCount = count * 6;
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (
            !inventory.canSwapItems(
                [{ name: 'ice_cube', amount: iceCount, metadata: null }],
                [{ name: 'water_bottle', amount: count, metadata: null }]
            )
        ) {
            this.notifier.notify(source, 'Vos poches sont pleines.', 'error');
            return;
        }

        const dstItem = this.itemService.getItem('ice_cube');
        const secItem = this.itemService.getItem('water_bottle');

        if (!inventory.remove('water_bottle', count, false)) {
            this.notifier.notify(source, `Vous n'avez pas assez de ${secItem.label}.`, 'error');
            return;
        }

        inventory.add('ice_cube', iceCount);

        this.notifier.notify(
            source,
            `Vous avez fait ~g~${iceCount}~s~ ${dstItem.label} avec ~g~${count}~s~ ${secItem.label}.`
        );
    }
}
