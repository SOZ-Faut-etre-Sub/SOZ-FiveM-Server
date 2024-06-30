import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick, TickInterval } from '../../../core/decorators/tick';
import { BankService } from '../../bank/bank.service';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Monitor } from '../../monitor/monitor';
import { Store } from '../../store/store';

const PROCESSING_STORAGE = 'garbage_processing';
const PROCESSING_AMOUNT = 300;

const DEFAULT_SELL_PRICE = 34;
const SELL_PRICE: Record<string, number> = {
    sawdust: 3,
    petroleum_residue: 9,
    seeweed_acid: 39,
    torn_garbagebag: 18,
    halloween_infernus_garbage: 18,
};

@Provider()
export class GarbageProvider {
    @Inject('Store')
    private store: Store;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Tick(TickInterval.EVERY_MINUTE)
    public async cleanGarbage() {
        const state = this.store.getState();

        if (state.global.blackoutLevel > 3 || state.global.blackout || state.global.jobEnergy.garbage < 1) {
            return;
        }

        const processingItems = this.inventoryManager.getAllItems(PROCESSING_STORAGE);

        if (processingItems.length == 0) {
            return;
        }

        let itemLeftToProcess = PROCESSING_AMOUNT;

        for (const item of processingItems) {
            const amountToProcess = Math.min(itemLeftToProcess, item.amount);

            if (this.inventoryManager.removeItemFromInventory(PROCESSING_STORAGE, item.item.name, amountToProcess)) {
                const sellPrice = SELL_PRICE[item.item.name] || DEFAULT_SELL_PRICE;
                const totalMoney = amountToProcess * sellPrice;

                await this.bankService.transferBankMoney('farm_garbage', 'safe_garbage', totalMoney);

                this.monitor.traceEvent('job_bluebird_recycling_garbage_bag', {
                    item_id: item.item.name,
                    item_count: amountToProcess,
                    money: totalMoney,
                });

                itemLeftToProcess -= amountToProcess;

                if (itemLeftToProcess <= 0) {
                    break;
                }
            }
        }
    }
}
