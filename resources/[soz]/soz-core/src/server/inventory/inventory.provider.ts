import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';
import { LockBinService } from '../job/bluebird/lock.bin.service';
import { InventoryManager } from './inventory.manager';

/**
 * Exposition of some methods from the InventoryManager to the clients
 */
@Provider()
export class InventoryProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(LockBinService)
    private lockBinService: LockBinService;

    @Rpc(RpcServerEvent.BIN_IS_NOT_LOCKED)
    public isBinLock(source: number, id: string) {
        return !this.lockBinService.isLock(id);
    }

    @Rpc(RpcServerEvent.INVENTORY_SEARCH)
    public onSearch(source: number, storageId: string, itemId: string) {
        return this.inventoryManager.search(storageId, 'amount', itemId);
    }
}
