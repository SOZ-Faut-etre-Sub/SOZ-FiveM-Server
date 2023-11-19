import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { JobPermission, JobType } from '../../../shared/job';
import { StonkBagType, StonkConfig } from '../../../shared/job/stonk';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { JobService } from '../../job.service';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class StonkCollectProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    private collectBagHistory: Record<string, Map<string, number>> = {};

    @OnEvent(ServerEvent.STONK_COLLECT)
    public async onCollect(source: number, brand: string, shop: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const [playerJob, playerJobGrade] = this.playerService.getPlayerJobAndGrade(source);

        if (
            !(await this.jobService.hasTargetJobPermission(
                JobType.CashTransfer,
                playerJob,
                playerJobGrade,
                JobPermission.CashTransfer_CollectBags
            ))
        ) {
            this.notifier.notify(source, `Vous n'avez pas les accréditations nécessaires.`, 'error');
            return;
        }

        const item = Object.keys(StonkConfig.collection).find(c =>
            StonkConfig.collection[c].takeInAvailableIn.includes(brand)
        ) as StonkBagType;

        if (!item) {
            return;
        }

        if (!this.inventoryManager.canCarryItem(source, item, StonkConfig.resell.amount)) {
            this.notifier.notify(source, `Vous n'avez pas ~r~assez~s~ de place dans vos poches.`);
            return;
        }

        if (!this.canCollect(player.citizenid, brand, shop, item)) {
            this.notifier.notify(source, `Ce magasin n'a plus de sacs actuellement !`, 'error');
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à collecter.', 'success');

        const outputItemLabel = this.itemService.getItem(item).label;
        const hasCollected = await this.doCollect(source, shop, item);

        if (hasCollected) {
            this.monitor.publish(
                'job_stonk_collect_bag',
                {
                    item_id: item,
                    player_source: source,
                },
                {
                    item_label: outputItemLabel,
                    quantity: StonkConfig.resell.amount,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                }
            );

            this.notifier.notify(source, `Vous avez collecté ${StonkConfig.resell.amount} ~g~${outputItemLabel}~s~.`);
        } else {
            this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de collecter.');
            return;
        }
    }

    private canCollect(citizenid: string, brand: string, shop: string, item: StonkBagType): boolean {
        if (!Object.values(StonkConfig.collection).some(item => item.takeInAvailableIn.includes(brand))) {
            return false;
        }

        if (!this.collectBagHistory[shop]) {
            return true;
        }

        const lastCollect = this.collectBagHistory[shop].get(citizenid) || 0;
        return lastCollect + StonkConfig.collection[item].timeout <= Date.now();
    }

    private async doCollect(source: number, shop: string, item: StonkBagType): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'stonk_collect',
            'Vous collectez...',
            StonkConfig.resell.collectionDuration,
            {
                dictionary: 'anim@mp_radio@garage@low',
                name: 'action_a',
                flags: 1,
            },
            {
                disableCombat: true,
                disableCarMovement: true,
                disableMovement: true,
            }
        );

        if (!completed) {
            return false;
        }

        const addRequest = this.inventoryManager.addItemToInventory(source, item, StonkConfig.resell.amount);

        if (this.collectBagHistory[shop] === undefined) {
            this.collectBagHistory[shop] = new Map();
        }
        this.collectBagHistory[shop].set(player.citizenid, Date.now());

        return addRequest.success;
    }
}
