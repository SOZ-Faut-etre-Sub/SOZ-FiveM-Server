import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { BaunConfig } from '../../../shared/job/baun';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class BaunResellProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ServerEvent.BAUN_RESELL)
    public async onResell(source: number) {
        const item = this.inventoryManager.getFirstItemInventory(source, 'cocktail_box');

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

        this.inventoryManager.removeItemFromInventory(source, 'cocktail_box', item.amount);

        const totalAmount = item.amount * BaunConfig.Resell.reward;
        TriggerEvent(ServerEvent.BANKING_TRANSFER_MONEY, 'farm_baun', 'safe_baun', totalAmount);

        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de revendre.', 'success');
    }
}
