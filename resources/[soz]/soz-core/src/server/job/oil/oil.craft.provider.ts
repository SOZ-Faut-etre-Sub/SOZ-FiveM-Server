import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

const oilCraftingMonitorEventsMap = {
    essence: 'job_mtp_create_gasoline',
    kerosene: 'job_mtp_create_gasoline',
    essence_jerrycan: 'job_mtp_create_jerrycan',
    kerosene_jerrycan: 'job_mtp_create_jerrycan',
};

@Provider()
export class OilCraftProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.OIL_CRAFT_ESSENCE)
    public async onCraftEssence(source: number) {
        await this.craft(source, 'petroleum_refined', 'essence', 1, 500);
    }

    @OnEvent(ServerEvent.OIL_CRAFT_ESSENCE_JERRYCAN)
    public async onCraftEssenceJerrycan(source: number) {
        await this.craft(source, 'essence', 'essence_jerrycan', 3, 30000, true);
    }

    @OnEvent(ServerEvent.OIL_CRAFT_KEROSENE)
    public async onCraftKerosene(source: number) {
        await this.craft(source, 'petroleum_refined', 'kerosene', 4, 250);
    }

    @OnEvent(ServerEvent.OIL_CRAFT_KEROSENE_JERRYCAN)
    public async onCraftKeroseneJerrycan(source: number) {
        await this.craft(source, 'kerosene', 'kerosene_jerrycan', 1, 30000, true);
    }

    private async craft(
        source: number,
        itemIdToRemove: string,
        itemIdToAdd: string,
        multiplier: number,
        baseDuration: number,
        fixedDuration = false
    ) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const itemToRemove = this.itemService.getItem(itemIdToRemove);
        const itemToAdd = this.itemService.getItem(itemIdToAdd);

        if (!itemToRemove || !itemToAdd) {
            return;
        }

        const baseRemoveAmount = this.inventoryManager.getItemCount(source, itemToRemove.name);

        if (baseRemoveAmount < multiplier) {
            this.notifier.notify(source, `Vous n'avez pas assez de ${itemToRemove.label}.`, 'error');

            return;
        }

        const addAmount = Math.floor(baseRemoveAmount / multiplier);
        const removeAmount = addAmount * multiplier;
        const duration = fixedDuration ? baseDuration : baseDuration * removeAmount;

        const { completed } = await this.progressService.progress(
            source,
            'craft_essence_jerrycan',
            'Vous transformez...',
            duration,
            {
                dictionary: 'amb@prop_human_bum_bin@base',
                name: 'base',
                options: {
                    repeat: true,
                },
            }
        );

        if (!completed) {
            return;
        }

        if (!this.inventoryManager.canSwapItem(source, itemIdToRemove, removeAmount, itemIdToAdd, addAmount)) {
            this.notifier.notify(source, `Vous êtes trop chargé.`, 'error');

            return;
        }

        if (!this.inventoryManager.removeNotExpiredItem(source, itemIdToRemove, removeAmount)) {
            return;
        }
        this.inventoryManager.addItemToInventory(source, itemIdToAdd, addAmount);

        this.notifier.notify(
            source,
            `Vous avez transformé ${removeAmount} x ${itemToRemove.label} en ${addAmount} x ${itemToAdd.label}.`,
            'success'
        );

        if (oilCraftingMonitorEventsMap[itemIdToAdd]) {
            this.monitor.traceEvent(oilCraftingMonitorEventsMap[itemIdToAdd], {
                player_source: source,
                amount: addAmount,
            });
        }
    }
}
