import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { BaunConfig } from '../../../shared/job/baun';
import { Monitor } from '../../../shared/monitor';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
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

    @Inject(Monitor)
    private monitor: Monitor;

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

        this.monitor.publish(
            'job_baun_resell',
            {
                item_id: item.metadata.id,
                player_source: source,
            },
            {
                item_label: item.label,
                quantity: item.amount,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );

        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de revendre.', 'success');
    }
}
