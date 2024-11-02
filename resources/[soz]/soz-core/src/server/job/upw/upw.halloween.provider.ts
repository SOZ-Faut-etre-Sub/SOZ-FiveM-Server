import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class UpwHalloweenProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.UPW_GET_BLESSED_WATER)
    public async getBlessedWater(source: number) {
        const { completed } = await this.progressService.progress(
            source,
            'upw.halloween.blessed_water',
            "Vous récupérez de l'eau bénite",
            5000,
            {
                name: 'weed_stand_checkingleaves_kneeling_01_inspector',
                dictionary: 'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
                flags: 1,
            }
        );

        if (!completed) {
            return;
        }

        if (!this.inventoryManager.addItemToInventory(source, 'halloween_blessed_water', 1).success) {
            this.notifier.notify(source, 'Vos poches sont pleines...', 'error');

            return;
        }

        this.notifier.notify(source, "Vous avez récupéré de ~g~l'eau bénite~s~", 'success');
    }
}
