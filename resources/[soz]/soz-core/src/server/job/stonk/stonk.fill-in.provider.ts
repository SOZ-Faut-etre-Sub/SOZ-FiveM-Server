import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { JobPermission, JobType } from '../../../shared/job';
import { StonkBagType, StonkConfig } from '../../../shared/job/stonk';
import { Monitor } from '../../../shared/monitor';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { BankService } from '../../bank/bank.service';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';
import { QBCore } from '../../qbcore';

@Provider()
export class StonkFillInProvider {
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

    @OnEvent(ServerEvent.STONK_FILL_IN)
    public async onFillIn(
        source: number,
        bank: string,
        item: StonkBagType,
        currentBalance: number,
        maxBalance: number
    ) {
        const [playerJob, playerJobGrade] = this.playerService.getPlayerJobAndGrade(source);

        if (
            !this.QBCore.hasJobPermission(
                JobType.CashTransfer,
                playerJob,
                playerJobGrade,
                JobPermission.CashTransfer_FillIn
            )
        ) {
            this.notifier.notify(source, `Vous n'avez pas les accreditations nécessaires.`, 'error');
            return;
        }

        if (!StonkConfig.collection[item].refill_value) {
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à remplir.', 'success');

        while (this.canFillIn(source, item, currentBalance, maxBalance)) {
            const outputItemLabel = this.itemService.getItem(item).label;
            const [hasResold, fillAmount] = await this.doFillIn(source, item, currentBalance, maxBalance);

            if (hasResold) {
                this.monitor.publish(
                    'job_stonk_fill_account',
                    {
                        item_id: item,
                        player_source: source,
                        account_type: 'bank',
                    },
                    {
                        item_label: outputItemLabel,
                        amount: fillAmount,
                        position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                    }
                );

                const transfer = await this.bankService.transferBankMoney(
                    StonkConfig.bankAccount.bankRefill,
                    bank.includes('atm') ? bank : `bank_${bank}`,
                    StonkConfig.collection[item].refill_value * fillAmount
                );
                if (!transfer) {
                    this.monitor.log('ERROR', 'Failed to transfer money to safe', {
                        account_source: StonkConfig.bankAccount.bankRefill,
                        account_destination: bank.includes('atm') ? bank : `bank_${bank}`,
                        amount: StonkConfig.collection[item].refill_value * fillAmount,
                    });
                }

                const transferSociety = await this.bankService.transferBankMoney(
                    StonkConfig.bankAccount.farm,
                    StonkConfig.bankAccount.safe,
                    StonkConfig.collection[item].society_gain * fillAmount
                );
                if (!transferSociety) {
                    this.monitor.log('ERROR', 'Failed to transfer money to safe', {
                        account_source: StonkConfig.bankAccount.farm,
                        account_destination: StonkConfig.bankAccount.safe,
                        amount: StonkConfig.collection[item].society_gain * fillAmount,
                    });
                }

                currentBalance += StonkConfig.collection[item].refill_value * fillAmount;

                this.notifier.notify(source, `Vous avez rempli ${fillAmount} ~g~${outputItemLabel}~s~.`);
            } else {
                this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de remplir.');
                return;
            }
        }
    }

    private numberOfItemsRequired(item: StonkBagType, currentBalance: number, maxBalance: number): number {
        return Math.floor((maxBalance - currentBalance) / StonkConfig.collection[item].refill_value);
    }

    private canFillIn(source: number, item: StonkBagType, currentBalance: number, maxBalance: number): boolean {
        return (
            this.inventoryManager.getFirstItemInventory(source, item) !== null &&
            this.numberOfItemsRequired(item, currentBalance, maxBalance) > 0
        );
    }

    private async doFillIn(
        source: number,
        item: StonkBagType,
        currentBalance: number,
        maxBalance: number
    ): Promise<[boolean, number]> {
        const { completed } = await this.progressService.progress(
            source,
            'stonk_fill_in',
            'Vous remplissez...',
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
        let fillInAmount = this.numberOfItemsRequired(item, currentBalance, maxBalance);

        if (!items) {
            return [false, 0];
        }

        if (fillInAmount > StonkConfig.resell.amount) {
            fillInAmount = StonkConfig.resell.amount;
        }

        if (fillInAmount > items.amount) {
            fillInAmount = items.amount;
        }

        const removeRequest = this.inventoryManager.removeItemFromInventory(source, item, fillInAmount);

        return [removeRequest, fillInAmount];
    }
}
