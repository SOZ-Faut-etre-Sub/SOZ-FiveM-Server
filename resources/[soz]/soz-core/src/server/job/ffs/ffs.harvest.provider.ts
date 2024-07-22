import { InventoryFactory } from '@public/server/inventory/inventory.factory';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { SewingRawMaterial } from '../../../shared/job/ffs';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { Inventory } from '../../inventory/inventory';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class FightForStyleHarvestProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    async doHarvest(source: number, inventory: Inventory, label: string) {
        const { completed } = await this.progressService.progress(source, 'ffs_harvest', label, 5000, {
            name: 'base',
            dictionary: 'amb@prop_human_bum_bin@base',
            flags: 1,
        });

        if (!completed) {
            return false;
        }

        inventory.add(SewingRawMaterial.COTTON_BALE, 1);

        return true;
    }

    @OnEvent(ServerEvent.FFS_HARVEST)
    async onHarvest(source: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return;
        }

        if (!inventory.canCarryItem(SewingRawMaterial.COTTON_BALE, 1)) {
            this.notifier.notify(
                source,
                `Vous ne possédez pas suffisamment de place dans votre inventaire pour récolter.`
            );
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à récolter');

        while (inventory.canCarryItem(SewingRawMaterial.COTTON_BALE, 1, {})) {
            const hasHarvested = await this.doHarvest(source, inventory, 'Vous récoltez une balle de coton.');
            if (!hasHarvested) {
                this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de récolter.`, 'error');
                return;
            }

            this.monitor.traceEvent('job_ffs_harvest', {
                item_id: SewingRawMaterial.COTTON_BALE,
                player_source: source,
                amount: 1,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            });

            this.notifier.notify(source, `Vous avez récolté une balle de coton.`);
        }
        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de récolter.', 'success');
    }
}
