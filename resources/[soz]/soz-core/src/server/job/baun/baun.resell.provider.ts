import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ItemService } from '@public/server/item/item.service';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { isInventoryItemExpired } from '../../../shared/inventory';
import { BaunConfig } from '../../../shared/job/baun';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { BankService } from '../../bank/bank.service';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class BaunResellProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(ItemService)
    private itemService: ItemService;

    @OnEvent(ServerEvent.BAUN_RESELL)
    public async onResell(source: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const item = inventory.findItem(item => item.name == 'cocktail_box' && !isInventoryItemExpired(item));

        if (!item) {
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à revendre.', 'success');
        const { completed } = await this.progressService.progress(
            source,
            'resell',
            'Revendre',
            BaunConfig.Resell.duration * item.amount,
            {
                name: 'base',
                dictionary: 'amb@prop_human_bum_bin@base',
                flags: 1,
            }
        );

        if (!completed) {
            return;
        }

        inventory.removeAtSlot(item.slot, item.amount);

        const totalAmount = item.amount * BaunConfig.Resell.reward;
        await this.bankService.transferFarmMoney(source, 'farm_baun', 'safe_baun', totalAmount);

        this.monitor.traceEvent('job_baun_resell', {
            item_id: item.name,
            player_source: source,
            amount: item.amount,
            position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
        });

        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de revendre.', 'success');
    }
}
