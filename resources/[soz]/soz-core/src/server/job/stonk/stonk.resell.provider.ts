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
export class StonkResellProvider {
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

    @OnEvent(ServerEvent.STONK_RESELL)
    public async onResell(source: number, item: StonkBagType) {
        const [playerJob, playerJobGrade] = this.playerService.getPlayerJobAndGrade(source);

        if (
            !(await this.jobService.hasTargetJobPermission(
                JobType.CashTransfer,
                playerJob,
                playerJobGrade,
                JobPermission.CashTransfer_ResaleBags
            ))
        ) {
            this.notifier.notify(source, `Vous n'avez pas les accréditations nécessaires.`, 'error');
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à déposer.', 'success');
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        while (inventory.hasEnoughItem(item, 1)) {
            const outputItemLabel = this.itemService.getItem(item).label;
            const [hasResold, resellAmount] = await this.doResell(source, inventory, item);

            if (hasResold) {
                this.monitor.traceEvent('job_stonk_resale_bag', {
                    item_id: item,
                    player_source: source,
                    item_label: outputItemLabel,
                    amount: resellAmount,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                });

                const transfer = await this.bankService.transferFarmMoney(
                    source,
                    StonkConfig.bankAccount.farm,
                    StonkConfig.bankAccount.safe,
                    StonkConfig.collection[item].society_gain * resellAmount
                );
                if (!transfer) {
                    this.logger.error(
                        `Failed to transfer money to safe ${JSON.stringify({
                            account_source: StonkConfig.bankAccount.farm,
                            account_destination: StonkConfig.bankAccount.safe,
                            amount: StonkConfig.collection[item].society_gain * resellAmount,
                        })}`
                    );
                }

                this.notifier.notify(source, `Vous avez déposé ${resellAmount} ~g~${outputItemLabel}~s~.`);
            } else {
                this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de déposer.');
                return;
            }
        }
    }

    private async doResell(source: number, inventory: Inventory, item: StonkBagType): Promise<[boolean, number]> {
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

        const inventoryItem = inventory.findItem(elem => elem.name == item && !isInventoryItemExpired(elem));

        if (!inventoryItem) {
            return [false, 0];
        }

        let resoldAmount = inventoryItem.amount;

        if (resoldAmount > StonkConfig.resell.amount) {
            resoldAmount = StonkConfig.resell.amount;
        }

        const removeRequest = inventory.removeAtSlot(inventoryItem.slot, resoldAmount);

        return [removeRequest, resoldAmount];
    }
}
