import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { UpwConfig, UpwConfigEnergyItem } from '@public/shared/job/upw';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Logger } from '../../../core/logger';
import { ServerEvent } from '../../../shared/event';
import { BankService } from '../../bank/bank.service';
import { Inventory } from '../../inventory/inventory';
import { ItemService } from '../../item/item.service';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class UpwResellProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(Logger)
    private logger: Logger;

    private findResellItem(inventory: Inventory) {
        for (const itemName of Object.values(UpwConfigEnergyItem)) {
            if (inventory.hasEnoughItem(itemName, 1, true)) {
                return itemName;
            }
        }
        return null;
    }

    @OnEvent(ServerEvent.UPW_RESELL)
    public async onResell(source: number) {
        this.notifier.notify(source, 'Vous ~g~commencez~s~ à revendre.', 'success');
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        while (inventory) {
            const itemName = this.findResellItem(inventory);
            if (!itemName) {
                break;
            }

            const itemDef = this.itemService.getItem(itemName);
            const { completed } = await this.progressService.progress(
                source,
                'upw_resell',
                'Vous déposez...',
                UpwConfig.Resale.Duration,
                {
                    dictionary: 'anim@mp_radio@garage@low',
                    name: 'action_a',
                }
            );

            if (!completed) {
                break;
            }

            if (!inventory.remove(itemName, 1, false)) {
                break;
            }

            const money = UpwConfig.Resale.EnergyCellPrice[itemName];
            this.monitor.traceEvent('job_upw_energy_resale', {
                player_source: source,
                item_id: itemName,
                item_label: itemDef.label,
                amount: 1,
                money,
            });

            await this.bankService.transferFarmMoney(source, UpwConfig.Order.farm, UpwConfig.Order.safe, money);

            this.notifier.notify(source, `Vous avez vendu 1 ~g~${itemDef.label}~s~.`);
        }
        this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de revendre.');
    }
}
