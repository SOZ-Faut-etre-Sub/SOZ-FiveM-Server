import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { InventoryItemMetadata } from '../../shared/inventory';
import { ItemService } from '../item/item.service';
import { InventoryFactory } from './inventory.factory';

/**
 * Exposition of some methods from the InventoryManager to the clients
 */
@Provider()
export class InventoryExportProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Exportable('GetItemsByType')
    public async legacyExportGetItemsByType(inventoryId: string, type: string) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        return Object.values(inventory.items())
            .filter(item => item.type === type)
            .map(item => ({ ...item, item: this.itemService.getItem(item.name) }));
    }

    @Exportable('GetItem')
    public async legacyExportGetItem(inventoryId: string, id: string) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        return inventory.getItem(id);
    }

    @Exportable('GetItemCount')
    public async legacyExportGetItemCount(inventoryId: string, id: string) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        return inventory.getItemCount(id);
    }

    @Exportable('CanCarryItem')
    public async legacyExportCanCarryItem(inventoryId: string, id: string, amount: number) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        return inventory.canCarryItem(id, amount);
    }

    @Exportable('RemoveItem')
    public async legacyExportRemoveItem(inventoryId: string, id: string, amount: number) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        return inventory.remove(id, amount);
    }

    @Exportable('AddItem')
    public async legacyExportAddItem(inventoryId: string, id: string, amount: number) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        return inventory.add(id, amount);
    }

    @Exportable('GetPlayerItemsByType')
    public async legacyExportGetPlayerItemsByType(source: number, type: string) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        return Object.values(inventory.items()).filter(item => item.type === type);
    }

    @Exportable('GetPlayerItem')
    public async legacyExportGetPlayerItem(source: number, id: string) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        return inventory.getItem(id);
    }

    @Exportable('CanPlayerCarryItem')
    public async legacyExportCanPlayerCarryItem(source: number, id: string, amount: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        return inventory.canCarryItem(id, amount);
    }

    @Exportable('CanPlayerCarryItems')
    public async legacyExportCanPlayerCarryItems(
        source: number,
        items: { name: string; amount?: number; metadata: InventoryItemMetadata | null }[]
    ) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        return inventory.canCarryItems(items);
    }

    @Exportable('RemovePlayerItem')
    public async legacyExportRemovePlayerItem(source: number, id: string, amount: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        return inventory.remove(id, amount);
    }

    @Exportable('AddPlayerItem')
    public async legacyExportAddPlayerItem(source: number, id: string, amount: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        return inventory.add(id, amount);
    }

    @Exportable('SetPlayerInventoryMaxWeight')
    public async legacyExportSetPlayerInventoryMaxWeight(source: number, maxWeight: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return;
        }

        return inventory.updateConfiguration({
            maxWeight,
        });
    }
}
