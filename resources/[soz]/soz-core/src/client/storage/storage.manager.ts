import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { InventoryItem } from '../../shared/item';
import { RpcEvent } from '../../shared/rpc';

@Injectable()
export class StorageManager {
    public async search(inventoryId: string, itemId: string): Promise<InventoryItem | InventoryItem[] | false> {
        return await emitRpc(RpcEvent.STORAGE_SEARCH, inventoryId, itemId);
    }
}
