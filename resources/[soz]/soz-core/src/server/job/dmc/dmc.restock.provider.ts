import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';
import { DmcResellconfig } from '@public/shared/job/dmc';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';

import { isInventoryItemExpired } from '../../../shared/inventory';
import { BankService } from '../../bank/bank.service';
import { ItemService } from '../../item/item.service';

@Provider()
export class DmcRestockProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(BankService)
    private bankService: BankService;

    @OnEvent(ServerEvent.DMC_RESTOCK)
    public async onDmcRestock(source: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const lsCustomStorage = await this.inventoryFactory.get('ls_custom_storage');
        const item = inventory.findItem(
            item => item.name == DmcResellconfig.resell_item && !isInventoryItemExpired(item)
        );

        if (!item) {
            return;
        }

        const maxAmount = item.amount;
        const itemWeight = this.itemService.getItem(DmcResellconfig.resell_item).weight;
        const availableWeight = lsCustomStorage.weight() || 0;
        const availableAmount = Math.floor(availableWeight / itemWeight);
        const toAddAmount = Math.min(maxAmount, availableAmount);
        const msg =
            availableAmount == 0
                ? 'Aucune pièce ajoutée au stock LS Custom. Le stock est déjà plein.'
                : maxAmount > availableAmount
                  ? `${toAddAmount} pièce(s) ajoutée(s) au stock LS Custom. Le stock est maintenant plein.`
                  : `${toAddAmount} pièce(s) ajoutée(s) au stock LS Custom.`;

        if (toAddAmount == 0) {
            this.notifier.notify(source, msg, 'error');
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à restocker le LS Custom', 'success');
        const { completed } = await this.progressService.progress(source, 'restock', 'Restockage', 2000 * toAddAmount, {
            name: 'givetake1_a',
            dictionary: 'mp_common',
            flags: 1,
        });

        if (!completed) {
            return;
        }

        if (!inventory.remove(DmcResellconfig.resell_item, toAddAmount, false)) {
            return;
        }

        lsCustomStorage.add(DmcResellconfig.resell_item, toAddAmount);

        const totalAmount = toAddAmount * DmcResellconfig.resell_price;
        await this.bankService.transferFarmMoney(source, 'farm_dmc', 'safe_dmc', totalAmount);

        this.monitor.traceEvent('job_dmc_restock', {
            item_id: item.name,
            player_source: source,
            amount: toAddAmount,
            position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
        });

        this.notifier.notify(source, msg, 'success');
    }
}
