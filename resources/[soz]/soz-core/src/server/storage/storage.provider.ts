import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { InventoryItem } from '../../shared/item';
import { RpcEvent } from '../../shared/rpc';

@Provider()
export class StorageProvider {
    private sozInventory: any;

    public constructor() {
        this.sozInventory = exports['soz-inventory'];
    }

    @Rpc(RpcEvent.STORAGE_SEARCH)
    public search(source: number, inventoryId: string, itemId: string): InventoryItem | InventoryItem[] | false {
        return this.sozInventory.Search(inventoryId, 'amount', itemId);
    }
}
