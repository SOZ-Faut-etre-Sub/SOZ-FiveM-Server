import { Inject, Injectable } from '../../core/decorators/injectable';
import { InventoryItem, InventoryItemMetadata } from '../../shared/item';
import { PlayerService } from '../player/player.service';

@Injectable()
export class InventoryManager {
    @Inject(PlayerService)
    private playerService: PlayerService;

    private sozInventory: any;

    public constructor() {
        this.sozInventory = exports['soz-inventory'];
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

    public findItem(source, predicate: (item: InventoryItem) => boolean): InventoryItem | null {
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

    public getItem(source: number, itemId: string, metadata?: InventoryItemMetadata): any {
        return this.sozInventory.GetItem(source, itemId, metadata);
    }

    public removeItemFromInventory(
        source: number,
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

    public canSwapItem(
        source: number,
        firstItemId: string,
        firstItemAmount: number,
        secondItemId: string,
        secondItemAmount: number
    ): boolean {
        return this.sozInventory.CanSwapItem(source, firstItemId, firstItemAmount, secondItemId, secondItemAmount);
    }
}
