import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { QBCore } from '@public/server/qbcore';
import { ServerEvent } from '@public/shared/event';
import { DmcResellconfig } from '@public/shared/job/dmc';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';

import { BankService } from '../../bank/bank.service';

@Provider()
export class DmcRestockProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(QBCore)
    private qbcore: QBCore;

    @Inject(BankService)
    private bankService: BankService;

    @OnEvent(ServerEvent.DMC_RESTOCK)
    public async onDmcRestock(source: number) {
        const item = this.inventoryManager.getFirstItemInventory(source, DmcResellconfig.resell_item);

        if (!item) {
            return;
        }

        const maxAmount = item.amount;
        const itemWeight = this.qbcore.getItem(DmcResellconfig.resell_item).weight;
        const availableWeight = await this.inventoryManager.getAvailableWeight('ls_custom_storage');
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

        this.inventoryManager.removeItemFromInventory(source, DmcResellconfig.resell_item, toAddAmount);
        this.inventoryManager.addItemToInventoryNotPlayer(
            'ls_custom_storage',
            DmcResellconfig.resell_item,
            toAddAmount
        );

        const totalAmount = toAddAmount * DmcResellconfig.resell_price;
        await this.bankService.transferFarmMoney(source, 'farm_dmc', 'safe_dmc', totalAmount);

        this.monitor.traceEvent('job_dmc_restock', {
            item_id: item.name,
            player_source: source,
            item_label: item.label,
            amount: toAddAmount,
            position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
        });

        this.notifier.notify(source, msg, 'success');
    }
}
