import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { JobPermission, JobType } from '../../../shared/job';
import { StonkBagType, StonkConfig } from '../../../shared/job/stonk';
import { Monitor } from '../../../shared/monitor';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { BankService } from '../../bank/bank.service';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';
import { QBCore } from '../../qbcore';

@Provider()
export class StonkCollectProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    private collectBagHistory: Record<string, { [key in string]?: number }> = {};

    @OnEvent(ServerEvent.STONK_COLLECT)
    public async onCollect(source: number, brand: string, shop: string) {
        const [playerJob, playerJobGrade] = this.playerService.getPlayerJobAndGrade(source);

        if (
            !this.QBCore.hasJobPermission(
                JobType.CashTransfer,
                playerJob,
                playerJobGrade,
                JobPermission.CashTransfer_CollectBags
            )
        ) {
            this.notifier.notify(source, `Vous n'avez pas les accreditations nécessaires.`, 'error');
            return;
        }

        const item = Object.keys(StonkConfig.collection).find(c =>
            StonkConfig.collection[c].takeInAvailableIn.includes(brand)
        ) as StonkBagType;

        if (!item) {
            return;
        }

        if (!this.canCollect(source, brand, shop, item)) {
            this.notifier.notify(source, `Ce magasin n'a plus de sac actuellement !`, 'error');
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
                    quantity: StonkConfig.collection[item].amount,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                }
            );

            this.notifier.notify(
                source,
                `Vous avez collecté ${StonkConfig.collection[item].amount} ~g~${outputItemLabel}~s~.`
            );
        } else {
            this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de collecter.');
            return;
        }
    }

    private canCollect(source: number, brand: string, shop: string, item: StonkBagType): boolean {
        const lastCollect = this.collectBagHistory[shop]?.[source] || 0;

        return (
            lastCollect + StonkConfig.collection[item].timeout <= new Date().getTime() &&
            Object.values(StonkConfig.collection).some(item => item.takeInAvailableIn.includes(brand))
        );
    }

    private async doCollect(source: number, shop: string, item: StonkBagType): Promise<boolean> {
        const { completed } = await this.progressService.progress(
            source,
            'stonk_collect',
            'Vous collectez...',
            StonkConfig.resell.duration,
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

        const addRequest = this.inventoryManager.addItemToInventory(source, item, StonkConfig.collection[item].amount);

        if (this.collectBagHistory[shop] === undefined) {
            this.collectBagHistory[shop] = {};
        }
        this.collectBagHistory[shop][source] = new Date().getTime();

        return addRequest.success;
    }
}
