import { ZoneOptions } from '../../../client/target/target.factory';
import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { CommonItem, InventoryItem } from '../../../shared/item';
import { JobType } from '../../../shared/job';
import { StonkConfig } from '../../../shared/job/stonk';
import { Monitor } from '../../../shared/monitor';
import { BankService } from '../../bank/bank.service';
import { FieldProvider } from '../../farm/field.provider';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';
import { QBCore } from '../../qbcore';

@Provider()
export class StonkDeliveryProvider {
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

    @Inject(FieldProvider)
    private fieldService: FieldProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    private fieldIdentifier = 'stonk_delivery';

    private getLiveryLocation(): ZoneOptions {
        const locationId = Math.ceil((new Date().getHours() / 4) % StonkConfig.delivery.location.length);
        return StonkConfig.delivery.location[locationId];
    }
    @Once(OnceStep.Start)
    public async onInit() {
        await this.fieldService.createField({
            identifier: this.fieldIdentifier,
            owner: JobType.CashTransfer,
            item: StonkConfig.delivery.item,
            capacity: 0,
            maxCapacity: 8,
            refill: {
                delay: 24 * 60 * 60 * 1000,
                amount: 1,
            },
            harvest: {
                delay: 0,
                amount: 1,
            },
        });

        this.itemService.setItemUseCallback(StonkConfig.delivery.item, this.useSecureContainer.bind(this));
    }

    public async useSecureContainer(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        TriggerClientEvent(ClientEvent.STONK_DELIVER_LOCATION, source, this.getLiveryLocation());
    }

    @OnEvent(ServerEvent.STONK_DELIVERY_TAKE)
    public async onTake(source: number) {
        if (!this.inventoryManager.canCarryItem(source, StonkConfig.delivery.item, 1)) {
            this.notifier.notify(source, `Vous n'avez pas ~r~assez~s~ de place dans vos poches.`, 'error');
            return false;
        }

        const { completed } = await this.progressService.progress(
            source,
            'stonk_delivery',
            'Vous récupérez une caisse...',
            StonkConfig.delivery.duration,
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

        const harvest = this.fieldService.harvestField(this.fieldIdentifier, 1);
        if (!harvest) {
            this.notifier.notify(source, `Vous n'avez plus de caisse à récupérer.`, 'error');
            return false;
        }

        const addRequest = this.inventoryManager.addItemToInventory(source, StonkConfig.delivery.item, 1);
        if (addRequest.success) {
            this.notifier.notify(source, `Vous avez ~g~récupéré~s~ une caisse.`);
        } else {
            this.notifier.notify(source, `Impossible de ~r~récupérer~s~ une caisse.`, 'error');
        }
    }

    @OnEvent(ServerEvent.STONK_DELIVERY_END)
    public async onEnd(source: number, location: ZoneOptions) {
        const currentLocation = this.getLiveryLocation();

        if (location.name !== currentLocation.name) {
            this.notifier.notify(source, `Vous n'êtes pas au bon endroit.`, 'error');
            return false;
        }

        const { completed } = await this.progressService.progress(
            source,
            'stonk_delivery',
            'Vous déposez une caisse...',
            StonkConfig.delivery.duration,
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

        if (this.inventoryManager.removeItemFromInventory(source, StonkConfig.delivery.item, 1)) {
            this.notifier.notify(source, `Vous avez ~g~déposé~s~ une caisse.`);

            const transfer = await this.bankService.transferBankMoney(
                StonkConfig.bankAccount.farm,
                StonkConfig.bankAccount.safe,
                StonkConfig.delivery.society_gain
            );
            if (!transfer) {
                this.monitor.log('ERROR', 'Failed to transfer money to safe', {
                    account_source: StonkConfig.bankAccount.farm,
                    account_destination: StonkConfig.bankAccount.safe,
                    amount: StonkConfig.delivery.society_gain,
                });
            }
        } else {
            this.notifier.notify(source, `Impossible de ~r~déposer~s~ une caisse.`, 'error');
        }
    }
}
