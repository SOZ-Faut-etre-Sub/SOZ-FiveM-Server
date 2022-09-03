import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Garment, LuxuryGarment } from '../../../shared/job/ffs';
import { ClothingBrand } from '../../../shared/shop';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class FightForStyleRestockProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.FFS_RESTOCK)
    public async onRestock(source: number, brand: ClothingBrand, garment: Garment | LuxuryGarment) {
        const item = this.inventoryManager.getFirstItemInventory(source, garment);

        if (!item) {
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à restocker le magasin de vêtements', 'success');
        const { completed } = await this.progressService.progress(source, 'restock', 'Restockage', 2000 * item.amount, {
            name: 'base',
            dictionary: 'amb@prop_human_bum_bin@base',
            flags: 1,
        });

        if (!completed) {
            return;
        }

        this.inventoryManager.removeItemFromInventory(source, garment, item.amount);

        exports['soz-shops'].RestockShop(brand, garment, item.amount);

        const totalAmount = item.amount * this.getRewardFromDeliveredGarment(garment);
        TriggerEvent(ServerEvent.BANKING_TRANSFER_MONEY, 'farm_ffs', 'safe_ffs', totalAmount);

        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de restocker le magasin de vêtements.', 'success');
    }

    private getRewardFromDeliveredGarment(garment: Garment | LuxuryGarment) {
        switch (garment) {
            case Garment.TOP:
            case Garment.PANT:
                return 30;
            case Garment.UNDERWEAR:
                return 12;
            case Garment.SHOES:
                return 21;
            case LuxuryGarment.TOP:
            case LuxuryGarment.PANT:
                return 60;
            case LuxuryGarment.UNDERWEAR:
                return 24;
            case LuxuryGarment.SHOES:
                return 42;
        }
    }
}
