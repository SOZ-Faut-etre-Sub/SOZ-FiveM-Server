import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { SewingRawMaterial } from '../../../shared/job/ffs';
import { InventoryManager } from '../../inventory/inventory.manager';
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
        if (!this.inventoryManager.canCarryItem(source, SewingRawMaterial.COTTON_BALE, 1)) {
            this.notifier.notify(
                source,
                `Vous ne possédez pas suffisamment de place dans votre inventaire pour récolter.`
            );
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à récolter');

        while (this.inventoryManager.canCarryItem(source, SewingRawMaterial.COTTON_BALE, 1, {})) {
            const hasHarvested = await this.doHarvest(source, 'Vous récoltez une balle de coton.');
            if (!hasHarvested) {
                this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de récolter.`, 'error');
                return;
            }
            this.notifier.notify(source, `Vous avez récolté une balle de coton.`);
        }
        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de récolter.', 'success');
    }
}
