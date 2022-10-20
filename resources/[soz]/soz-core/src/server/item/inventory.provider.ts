import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcEvent } from '../../shared/rpc';
import { InventoryManager } from './inventory.manager';

/**
 * Exposition of some methods from the InventoryManager to the clients
 */
@Provider()
export class InventoryProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Rpc(RpcEvent.INVENTORY_SEARCH)
    public onSearch(source: number, storageId: string, itemId: string) {
        return this.inventoryManager.search(storageId, 'amount', itemId);
    }
}
