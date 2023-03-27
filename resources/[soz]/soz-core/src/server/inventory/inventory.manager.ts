import { ItemService } from '@public/server/item/item.service';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { InventoryItem, InventoryItemMetadata } from '../../shared/item';
import { PlayerService } from '../player/player.service';

@Injectable()
export class InventoryManager {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    private sozInventory: any;

    public constructor() {
        this.sozInventory = exports['soz-inventory'];
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

    public getItem(inventory: number | string, itemId: string, metadata?: InventoryItemMetadata): any {
        return this.sozInventory.GetItem(inventory, itemId, metadata);
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
        source: number,
        itemId: string,
        amount = 1,
        metadata?: InventoryItemMetadata,
        slot?: number
    ): { success: boolean; reason?: string } {
        let success, reason;

        this.sozInventory.AddItem(source, itemId, amount, metadata, slot, (s, r) => {
            success = s;
            reason = r;
        });

        return { success, reason };
    }

    public canCarryItem(source: number, itemId: string, amount: number, metadata?: InventoryItemMetadata): boolean {
        return this.sozInventory.CanCarryItem(source, itemId, amount, metadata);
    }

    public canCarryItems(
        source: number,
        items: { name: string; amount: number }[],
        metadata?: InventoryItemMetadata
    ): boolean {
        return this.sozInventory.CanCarryItems(source, items, metadata);
    }

    public canSwapItem(
        source: number,
        firstItemId: string,
        firstItemAmount: number,
        secondItemId: string,
        secondItemAmount: number
    ): boolean {
        return this.sozInventory.CanSwapItem(source, firstItemId, firstItemAmount, secondItemId, secondItemAmount);
    }

    public hasEnoughItem(source: number, itemId: string, amount?: number, skipExpiredItem?: boolean): boolean {
        const items = this.getItems(source);
        let count = 0;

        for (const item of items) {
            if (item.name === itemId) {
                if (skipExpiredItem && this.itemService.isItemExpired(item)) {
                    continue;
                }

                if (!amount) {
                    return true;
                }

                count += item.amount;
            }
        }

        if (amount) {
            return count >= amount;
        }

        return false;
    }

    // TODO: Implement the following method in soz core directly
    // public canSwapItem(source: number, { id: string; amount: number; }[], { id: string; amount: number;}[]): boolean {
}
