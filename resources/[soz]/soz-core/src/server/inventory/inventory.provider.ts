import { OnEvent } from '@public/core/decorators/event';
import { ServerEvent } from '@public/shared/event';

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

    private lockedBin: string[] = [];

    @Rpc(RpcEvent.BIN_IS_LOCKED)
    public isBinLock(source: number, id: string) {
        return !this.lockedBin.includes(id);
    }

    @OnEvent(ServerEvent.BIN_CHANGE_LOCK_STATUS)
    public onBinChangeLockStatus(source: number, id: string, status: boolean) {
        if (status) {
            if (!this.lockedBin.includes(id)) {
                this.lockedBin.push(id);
            }
        } else {
            const index = this.lockedBin.indexOf(id, 0);
            if (index > -1) {
                this.lockedBin.splice(index, 1);
            }
        }
    }

    @Rpc(RpcEvent.INVENTORY_SEARCH)
    public onSearch(source: number, storageId: string, itemId: string) {
        return this.inventoryManager.search(storageId, 'amount', itemId);
    }
}
