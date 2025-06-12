import { Inventory } from '@public/server/inventory/inventory';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { InventoryItem } from '@public/shared/inventory';
import { Item } from '@public/shared/item';

import { Once, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { Vector3 } from '../../../shared/polyzone/vector';
import { isErr } from '../../../shared/result';
import { ItemService } from '../../item/item.service';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';
import { RESTOCK_CONFIG } from './baun.restock.provider';

@Provider()
export class BaunHarvestProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(ItemService)
    private itemService: ItemService;

    @Once()
    public onStart() {
        this.itemService.setItemUseCallback('beer_crate', this.useBeerCrate.bind(this));
    }

    private async useBeerCrate(source: number, item: Item, inventoryItem: InventoryItem, inventory: Inventory) {
        if (inventory.canCarryItems([{ name: 'beer_crate', amount: -1 }, ...RESTOCK_CONFIG.beer_crate])) {
            inventory.removeAtSlot(inventoryItem.slot, 1);

            for (const beer of RESTOCK_CONFIG.beer_crate) {
                inventory.add(beer.name, beer.amount, inventoryItem.metadata);
            }
        }
    }

    @OnEvent(ServerEvent.BAUN_HARVEST)
    public async onHarvest(source: number, item: string) {
        const itemData = this.itemService.getItem(item);
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (!inventory.canCarryItem(item, 1)) {
                this.notifier.notify(source, `Vous ne pouvez pas porter plus de ${itemData.label}.`, 'error');

                return;
            }

            const { completed } = await this.progressService.progress(
                source,
                'harvest-crate',
                'Récolte en cours...',
                2000,
                {
                    dictionary: 'amb@prop_human_bum_bin@base',
                    name: 'base',
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
                return;
            }

            const result = inventory.add(item, 1);

            if (isErr(result)) {
                this.notifier.notify(
                    source,
                    `Vous ne pouvez pas porter plus de ${itemData.label} : ${result.err}.`,
                    'error'
                );

                return;
            }

            this.notifier.notify(source, `Vous avez récolté ${itemData.label}.`, 'success');

            this.monitor.traceEvent('job_baun_harvest', {
                item_id: item,
                player_source: source,
                amount: 1,
                position: GetEntityCoords(GetPlayerPed(source)) as Vector3,
            });
        }
    }
}
