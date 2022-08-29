import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { SewingRawMaterial } from '../../../shared/job/ffs';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class FightForStyleHarvestProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    async doHarvest(source: number, label: string) {
        const { completed } = await this.progressService.progress(source, 'ffs_harvest', label, 5000, {
            name: 'base',
            dictionary: 'amb@prop_human_bum_bin@base',
            flags: 1,
        });

        if (!completed) {
            return false;
        }

        this.inventoryManager.addItemToInventory(source, SewingRawMaterial.COTTON_BALE, 1);

        return true;
    }

    @OnEvent(ServerEvent.FFS_HARVEST)
    async onHarvest(source: number) {
        while (this.inventoryManager.canCarryItem(source, SewingRawMaterial.COTTON_BALE, 1, {})) {
            const hasHarvested = await this.doHarvest(source, 'Vous récoltez une balle de coton.');
            if (!hasHarvested) {
                return;
            }
        }
        this.notifier.notify(source, 'Vous avez terminé de récolter.', 'success');
    }
}
