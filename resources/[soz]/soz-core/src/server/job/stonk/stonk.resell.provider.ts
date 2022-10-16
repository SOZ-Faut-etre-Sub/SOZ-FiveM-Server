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
export class StonkResellProvider {
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

    @OnEvent(ServerEvent.STONK_RESELL)
    public async onResell(source: number, item: StonkBagType) {
        const [playerJob, playerJobGrade] = this.playerService.getPlayerJobAndGrade(source);

        if (
            !this.QBCore.hasJobPermission(
                JobType.CashTransfer,
                playerJob,
                playerJobGrade,
                JobPermission.CashTransfer_ResaleBags
            )
        ) {
            this.notifier.notify(source, `Vous n'avez pas les accreditations nécessaires.`, 'error');
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à déposer.', 'success');

        while (this.canResell(source, item)) {
            const outputItemLabel = this.itemService.getItem(item).label;
            const [hasResold, resellAmount] = await this.doResell(source, item);

            if (hasResold) {
                this.monitor.publish(
                    'job_stonk_resale_bag',
                    {
                        item_id: item,
                        player_source: source,
                    },
                    {
                        item_label: outputItemLabel,
                        quantity: resellAmount,
                        position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                    }
                );

                const transfer = await this.bankService.transferBankMoney(
                    StonkConfig.bankAccount.farm,
                    StonkConfig.bankAccount.safe,
                    StonkConfig.collection[item].society_gain * resellAmount
                );
                if (!transfer) {
                    this.monitor.log('ERROR', 'Failed to transfer money to safe', {
                        account_source: StonkConfig.bankAccount.farm,
                        account_destination: StonkConfig.bankAccount.safe,
                        amount: StonkConfig.collection[item].society_gain * resellAmount,
                    });
                }

                this.notifier.notify(source, `Vous avez déposé ${resellAmount} ~g~${outputItemLabel}~s~.`);
            } else {
                this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de déposer.');
                return;
            }
        }
    }

    private canResell(source: number, item: StonkBagType): boolean {
        return this.inventoryManager.getFirstItemInventory(source, item) !== null;
    }

    private async doResell(source: number, item: StonkBagType): Promise<[boolean, number]> {
        const { completed } = await this.progressService.progress(
            source,
            'stonk_resell',
            'Vous déposez...',
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
            return [false, 0];
        }

        const items = this.inventoryManager.getFirstItemInventory(source, item);
        let resoldAmount = items.amount;

        if (!items) {
            return [false, 0];
        }

        if (resoldAmount > StonkConfig.resell.amount) {
            resoldAmount = StonkConfig.resell.amount;
        }

        const removeRequest = this.inventoryManager.removeItemFromInventory(source, item, resoldAmount);

        return [removeRequest, resoldAmount];
    }
}
