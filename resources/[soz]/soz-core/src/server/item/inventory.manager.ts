import { Injectable } from '../../core/decorators/injectable';
import { InventoryItemMetadata } from '../../shared/item';

@Injectable()
export class InventoryManager {
    private sozInventory: any;

    public constructor() {
        this.sozInventory = exports['soz-inventory'];
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
}
