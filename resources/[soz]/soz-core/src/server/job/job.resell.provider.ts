import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event/server';
import { InventoryItem, isInventoryItemExpired } from '../../shared/inventory';
import { JobResellZones } from '../../shared/job';
import { BankService } from '../bank/bank.service';
import { InventoryFactory } from '../inventory/inventory.factory';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';

@Provider()
export class JobResellProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.JOB_RESELL_ITEM)
    public async resell(
        source: number,
        inventoryId: string,
        inventoryItem: InventoryItem,
        amount: number,
        resellZoneId: string
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.get(inventoryId);

        if (!inventory) {
            return;
        }

        const resellZone = JobResellZones[resellZoneId];

        if (!resellZone) {
            this.notifier.error(source, 'Zone de revente invalide');

            return;
        }

        const item = this.itemService.getItem(inventoryItem.name);

        if (!item) {
            this.notifier.error(source, "L'objet n'existe pas");

            return;
        }

        if (isInventoryItemExpired(inventoryItem)) {
            this.notifier.error(source, 'Vous ne pouvez pas revendre des produits périmés');

            return;
        }

        if (amount <= 0 || amount > inventoryItem.amount) {
            this.notifier.error(source, 'Quantité invalide');

            return;
        }

        if (!item.resellPrice || item.resellZone !== resellZoneId) {
            this.notifier.error(source, 'Cet objet ne peut pas être revendu');

            return;
        }

        if (resellZone.inventory_id) {
            const targetInventory = await this.inventoryFactory.get(resellZone.inventory_id);

            if (targetInventory) {
                let createAmount = amount;

                if (item.resellItemTierMultiplier && inventoryItem.metadata.tier) {
                    createAmount = amount * item.resellItemTierMultiplier[inventoryItem.metadata.tier - 1];
                }

                const availableWeight = Math.max(targetInventory.maxWeight() - targetInventory.weight(), 0);
                const availableAmount = Math.floor(availableWeight / item.weight);
                createAmount = Math.min(createAmount, availableAmount);

                if (createAmount > 0) {
                    targetInventory.add(inventoryItem.name, createAmount);
                    this.notifier.error(source, `${createAmount} objet(s) ajouté(s) au stock.`);
                } else {
                    this.notifier.error(source, 'Aucun objet ajouté au stock, il est déjà plein.');
                }
            }
        }

        let resellPrice = item.resellPrice;

        if (Array.isArray(resellPrice)) {
            resellPrice = resellPrice[inventoryItem.metadata.tier ? inventoryItem.metadata.tier - 1 : 0];
        }

        const totalPrice = resellPrice * amount;

        const resultTransfer = await this.bankService.transferFarmMoney(
            source,
            resellZone.source_account,
            resellZone.target_account,
            totalPrice
        );

        if (!resultTransfer) {
            this.notifier.error(source, "l'acheteur n'a pas assez d'argent.");

            return;
        }

        inventory.removeAtSlot(inventoryItem.slot, amount);

        this.notifier.notify(source, `Vous avez vendu ~o~${amount} ~b~${item.label}`);

        this.monitor.traceEvent('job_resell', {
            player_source: source,
            item_id: inventoryItem.name,
            amount,
            money: totalPrice,
            source_account: resellZone.source_account,
            target_account: resellZone.target_account,
        });
    }
}
