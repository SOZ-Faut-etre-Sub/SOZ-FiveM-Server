import { InventoryFactory } from '@public/server/inventory/inventory.factory';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Logger } from '../../../core/logger';
import { ServerEvent } from '../../../shared/event';
import { isInventoryItemExpired } from '../../../shared/inventory';
import { JobPermission, JobType } from '../../../shared/job';
import { StonkBagType, StonkConfig } from '../../../shared/job/stonk';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { BankService } from '../../bank/bank.service';
import { Inventory } from '../../inventory/inventory';
import { ItemService } from '../../item/item.service';
import { JobService } from '../../job.service';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class StonkFillInProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(Logger)
    private logger: Logger;

    @OnEvent(ServerEvent.STONK_FILL_IN)
    public async onFillIn(source: number, accountName: string, item: StonkBagType, maxBalance: number) {
        const [playerJob, playerJobGrade] = this.playerService.getPlayerJobAndGrade(source);

        if (
            !(await this.jobService.hasTargetJobPermission(
                JobType.CashTransfer,
                playerJob,
                playerJobGrade,
                JobPermission.CashTransfer_FillIn
            ))
        ) {
            this.notifier.notify(source, `Vous n'avez pas les accréditations nécessaires.`, 'error');
            return;
        }

        if (!StonkConfig.collection[item].refill_value) {
            return;
        }

        let currentBalance = await this.bankService.getAccountMoney(accountName);
        if (currentBalance >= maxBalance) {
            this.notifier.notify(source, "C'est déjà ~r~rempli~s~");
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à remplir.', 'success');

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        do {
            const outputItemLabel = this.itemService.getItem(item).label;
            const [hasResold, fillAmount] = await this.doFillIn(source, inventory, item, maxBalance, accountName);

            if (hasResold) {
                this.monitor.traceEvent('job_stonk_fill_account', {
                    item_id: item,
                    player_source: source,
                    account_type: 'bank',
                    item_label: outputItemLabel,
                    amount: fillAmount,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                });

                currentBalance = await this.bankService.getAccountMoney(accountName);
                const transfer = await this.bankService.transferFarmMoney(
                    source,
                    StonkConfig.bankAccount.bankRefill,
                    accountName,
                    Math.min(StonkConfig.collection[item].refill_value * fillAmount, maxBalance - currentBalance)
                );
                if (!transfer) {
                    this.logger.error(
                        `Failed to transfer money to safe ${JSON.stringify({
                            account_source: StonkConfig.bankAccount.bankRefill,
                            account_destination: accountName,
                            amount: StonkConfig.collection[item].refill_value * fillAmount,
                        })}`
                    );
                }

                const transferSociety = await this.bankService.transferFarmMoney(
                    source,
                    StonkConfig.bankAccount.farm,
                    StonkConfig.bankAccount.safe,
                    StonkConfig.collection[item].society_gain * fillAmount
                );
                if (!transferSociety) {
                    this.logger.error(
                        `Failed to transfer money to safe ${JSON.stringify({
                            account_source: StonkConfig.bankAccount.farm,
                            account_destination: StonkConfig.bankAccount.safe,
                            amount: StonkConfig.collection[item].society_gain * fillAmount,
                        })}`
                    );
                }

                this.notifier.notify(source, `Vous avez rempli ${fillAmount} ~g~${outputItemLabel}~s~.`);
            } else {
                this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de remplir.');
                return;
            }

            currentBalance = await this.bankService.getAccountMoney(accountName);
        } while (currentBalance < maxBalance);
    }

    private async doFillIn(
        source: number,
        inventory: Inventory,
        item: StonkBagType,
        maxBalance: number,
        accountName: string
    ): Promise<[boolean, number]> {
        const preCheckinventoryItem = inventory.findItem(elem => elem.name == item && !isInventoryItemExpired(elem));
        if (!preCheckinventoryItem) {
            return [false, 0];
        }

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

        const inventoryItem = inventory.findItem(elem => elem.name == item && !isInventoryItemExpired(elem));
        if (!inventoryItem) {
            return [false, 0];
        }

        const currentBalance = await this.bankService.getAccountMoney(accountName);
        const fillInAmount = Math.min(
            Math.ceil((maxBalance - currentBalance) / StonkConfig.collection[item].refill_value),
            StonkConfig.resell.amount,
            inventoryItem.amount
        );

        if (fillInAmount == 0) {
            return [false, 0];
        }

        const removeRequest = inventory.removeAtSlot(inventoryItem.slot, fillInAmount);

        return [removeRequest, fillInAmount];
    }
}
