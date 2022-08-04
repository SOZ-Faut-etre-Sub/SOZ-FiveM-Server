import { Inject, Injectable } from '../../core/decorators/injectable';
import { InventoryItem, Item, ItemType } from '../../shared/item';
import { QBCore } from '../qbcore';

@Injectable()
export class ItemService {
    @Inject(QBCore)
    private qbcore: QBCore;

    public getItems<T extends Item = Item>(type?: ItemType): Record<string, T> {
        return this.qbcore.getItems(type);
    }

    public getItem<T extends Item = Item>(id: string): T | null {
        return this.qbcore.getItem<T>(id);
    }

    public setItemUseCallback<T extends Item = Item>(
        itemId: string,
        callback: (player: number, item: T, inventoryItem: InventoryItem) => void
    ) {
        this.qbcore.createUseableItem(itemId, (player: number, item: any) => {
            const inventoryItem = item as InventoryItem;

            if (inventoryItem.metadata) {
                inventoryItem.metadata.expiration = new Date(inventoryItem.metadata.expiration);
            }

            callback(player, this.qbcore.getItem<T>(itemId), inventoryItem);
        });
    }
}
