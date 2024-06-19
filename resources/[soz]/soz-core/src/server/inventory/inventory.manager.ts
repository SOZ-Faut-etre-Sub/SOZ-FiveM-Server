import { PrismaService } from '@public/server/database/prisma.service';
import { ItemService } from '@public/server/item/item.service';
import { Storage, StorageType } from '@public/shared/inventory';
import { VehicleClass } from '@public/shared/vehicle/vehicle';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { Inventory, InventoryItem, InventoryItemMetadata, Item } from '../../shared/item';
import { PlayerService } from '../player/player.service';

type AllItemItem = {
    amount: number;
    metadata: InventoryItemMetadata;
    item: Item;
    slot: number;
};

@Injectable()
export class InventoryManager {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PrismaService)
    private prisma: PrismaService;

    private sozInventory: any;

    public constructor() {
        this.sozInventory = exports['soz-inventory'];
    }

    private async getStorage(id: string): Promise<Storage | null> {
        const storage = await this.prisma.storages.findUnique({
            where: {
                name: id,
            },
        });

        if (!storage) {
            return null;
        }

        return {
            type: storage.type as StorageType,
            id: storage.name,
            inventory: storage.inventory ? (JSON.parse(storage.inventory) as InventoryItem[]) : [],
            maxWeight: storage.max_weight,
            maxSlots: storage.max_slots,
            owner: storage.owner,
        };
    }

    public getItems(source: number): InventoryItem[] {
        const items = this.playerService.getPlayer(source).items;

        if (Array.isArray(items)) {
            return items;
        } else {
            return Object.keys(items).map(key => items[key]);
        }
    }

    // deprecated: Use findItem instead
    public getFirstItemInventory(source: number, itemId: string): InventoryItem | null {
        let inventoryItem = null;

        const items = this.playerService.getPlayer(source).items;

        if (Array.isArray(items)) {
            for (const item of items) {
                if (item.name === itemId) {
                    inventoryItem = item;
                    break;
                }
            }
        } else {
            for (const slot of Object.keys(items)) {
                const item = items[slot];

                if (item.name === itemId) {
                    inventoryItem = item;
                    break;
                }
            }
        }

        return inventoryItem;
    }

    public getOrCreateInventory(
        trunkType: string,
        plate: string,
        context: { model: string | number; class: VehicleClass; entity?: number }
    ): Inventory | null {
        return this.sozInventory.GetOrCreateInventory(trunkType, plate, context);
    }

    public async getVehicleStorageWeight(plate: string): Promise<number> {
        const inventory = this.sozInventory.GetOrCreateInventory('trunk', plate);

        if (inventory) {
            return inventory.weight;
        }

        const storage = await this.getStorage('trunk_' + plate);

        if (!storage) {
            return 0;
        }

        return this.sozInventory.CalculateWeight(storage.inventory);
    }

    public async getAvailableWeight(inv: string): Promise<number> {
        return this.sozInventory.CalculateAvailableWeight(inv);
    }

    public findItem(source: number, predicate: (item: InventoryItem) => boolean): InventoryItem | null {
        const items = this.playerService.getPlayer(source).items;

        if (Array.isArray(items)) {
            return items.find(predicate) || null;
        } else {
            return (
                Object.keys(items)
                    .map(key => items[key])
                    .find(predicate) || null
            );
        }
    }

    public getItem(inventory: number | string, itemId: string, metadata?: InventoryItemMetadata): InventoryItem {
        return this.sozInventory.GetItem(inventory, itemId, metadata);
    }

    public getAllItems(inventory: string): AllItemItem[] {
        return this.sozInventory.GetAllItems(inventory);
    }

    public getItemCount(inventory: number | string, itemId: string, metadata: InventoryItemMetadata = null): number {
        return this.sozInventory.GetItem(inventory, itemId, metadata, true);
    }

    public getSlot(source: number, slot: number): InventoryItem | null {
        return this.sozInventory.GetSlot(source, slot);
    }

    public updateMetadata(source: number, slot: number, metadata: InventoryItemMetadata): void {
        return this.sozInventory.SetMetadata(source, slot, metadata);
    }

    public search(
        source: number | string,
        searchType: 'slots' | 'amount',
        itemId: string,
        metadata?: InventoryItemMetadata
    ): InventoryItem | InventoryItem[] | false {
        return this.sozInventory.Search(source, searchType, itemId, metadata);
    }

    public removeInventoryItem(source, item: InventoryItem, amount = 1): boolean {
        return this.removeItemFromInventory(source, item.name, amount, item.metadata, item.slot);
    }

    public removeNotExpiredItem(source, itemId: string, amount = 1, metadata?: InventoryItemMetadata): boolean {
        const items = this.getItems(source);
        const countBySlot = new Map<number, number>();
        let count = 0;

        for (const item of items) {
            if (item.name === itemId) {
                if (this.itemService.isItemExpired(item)) {
                    continue;
                }

                if (metadata) {
                    let metadataOK = false;
                    for (const key of Object.keys(metadata)) {
                        if (metadata[key] == item.metadata[key]) {
                            metadataOK = true;
                            break;
                        }
                    }
                    if (!metadataOK) {
                        continue;
                    }
                }

                if (count + item.amount > amount) {
                    const countLeft = amount - count;
                    count += countLeft;
                    countBySlot.set(item.slot, countLeft);
                    break;
                }

                countBySlot.set(item.slot, item.amount);
                count += item.amount;

                if (count === amount) {
                    break;
                }
            }
        }

        if (count !== amount) {
            return false;
        }

        for (const [slot, amount] of countBySlot) {
            this.removeItemFromInventory(source, itemId, amount, undefined, slot);
        }

        return true;
    }

    public removeItemFromInventory(
        source: number | string,
        itemId: string,
        amount = 1,
        metadata?: InventoryItemMetadata,
        slot?: number
    ): boolean {
        return this.sozInventory.RemoveItem(source, itemId, amount, metadata, slot);
    }

    public addItemToInventory(
        source: number | string,
        itemId: string,
        amount = 1,
        metadata?: InventoryItemMetadata,
        slot?: number
    ): { success: boolean; reason?: string } {
        let success, reason;

        this.sozInventory.AddItem(source, source, itemId, amount, metadata, slot, (s, r) => {
            success = s;
            reason = r;
        });

        return { success, reason };
    }

    public addItemToInventoryNotPlayer(
        inventoryId: string,
        itemId: string,
        amount = 1,
        metadata?: InventoryItemMetadata,
        slot?: number
    ): { success: boolean; reason?: string } {
        let success, reason;

        this.sozInventory.AddItem(-2, inventoryId, itemId, amount, metadata, slot, (s, r) => {
            success = s;
            reason = r;
        });

        return { success, reason };
    }

    public canCarryItem(
        source: number | string,
        itemId: string,
        amount: number,
        metadata?: InventoryItemMetadata
    ): boolean {
        return this.sozInventory.CanCarryItem(source, itemId, amount, metadata);
    }

    public canCarryItems(
        source: number | string,
        items: { name: string; amount: number }[],
        metadata?: InventoryItemMetadata
    ): boolean {
        return this.sozInventory.CanCarryItems(source, items, metadata);
    }

    public canSwapItem(
        source: number | string,
        firstItemId: string,
        firstItemAmount: number,
        secondItemId: string,
        secondItemAmount: number
    ): boolean {
        return this.sozInventory.CanSwapItem(source, firstItemId, firstItemAmount, secondItemId, secondItemAmount);
    }

    public canSwapItems(
        source: number | string,
        outItems: { name: string; amount: number; metadata: InventoryItemMetadata }[],
        inItems: { name: string; amount: number; metadata: InventoryItemMetadata }[]
    ): boolean {
        return this.sozInventory.CanSwapItems(source, outItems, inItems);
    }

    public hasEnoughItem(
        source: number,
        itemId: string,
        amount?: number,
        skipExpiredItem?: boolean,
        metadata?: InventoryItemMetadata
    ): boolean {
        const items = this.getItems(source);
        let count = 0;

        if (amount <= 0) {
            return true;
        }

        for (const item of items) {
            if (item.name === itemId) {
                if (skipExpiredItem && this.itemService.isItemExpired(item)) {
                    continue;
                }

                if (metadata) {
                    let metadataOK = false;
                    for (const key of Object.keys(metadata)) {
                        if (metadata[key] == item.metadata[key]) {
                            metadataOK = true;
                            break;
                        }
                    }
                    if (!metadataOK) {
                        continue;
                    }
                }

                count += item.amount;
            }
        }

        if (amount) {
            return count >= amount;
        }

        return false;
    }

    public clearApartment(apartmentIdentifier: string): void {
        this.sozInventory.ClearByOwner(apartmentIdentifier);
        this.sozInventory.SetHouseStashAndFridgeMaxWeightFromTier(apartmentIdentifier, 0);
    }

    public setHouseStashAndFridgeMaxWeightFromTier(apartmentIdentifier: string, tier: number): void {
        this.sozInventory.SetHouseStashAndFridgeMaxWeightFromTier(apartmentIdentifier, tier);
    }

    public clear(id: string): void {
        this.sozInventory.Clear(id);
    }

    public errorMessage(reason: string) {
        return this.sozInventory.ErrorMessage(reason);
    }

    public updateVehMaxWeight(
        type: string,
        plate: string,
        ctx: { model: string; class: string; entity: number }
    ): void {
        this.sozInventory.UpdateVehMaxWeight(type, plate, ctx);
    }

    public updateVehPlate(
        type: string,
        plate: string,
        ctx: { model: string; class: string; entity: number },
        newPlate: string
    ): void {
        this.sozInventory.UpdateVehPlate(type, plate, ctx, newPlate);
    }

    public transfertItem(
        source: number,
        invSource: string | number,
        invTarget: string | number,
        item: string,
        amount = 1,
        slot?: number,
        metadata?: InventoryItemMetadata,
        targetSlot?: number
    ): { success: boolean; reason?: string } {
        const ret = this.sozInventory.TransfertItem(
            source,
            invSource,
            invTarget,
            item,
            amount,
            metadata,
            slot,
            targetSlot
        );
        return {
            success: ret[0],
            reason: ret[1],
        };
    }

    public clearInv(id: string) {
        this.sozInventory.Clear(id);
    }

    public deleteInv(id: string) {
        this.sozInventory.Delete(id);
    }

    // TODO: Implement the following method in soz core directly
    // public canSwapItem(source: number, { id: string; amount: number; }[], { id: string; amount: number;}[]): boolean {
}
