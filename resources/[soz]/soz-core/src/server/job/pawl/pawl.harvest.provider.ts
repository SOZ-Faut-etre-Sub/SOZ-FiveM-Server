import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ServerEvent } from '@public/shared/event';

@Provider()
export class PawlHarvestProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @OnEvent(ServerEvent.PAWL_DECREASE_CHAINSAW_FUEL)
    public decreaseFuel(source, data) {
        this.inventoryManager.updateMetadata(source, data.slot, { fuel: data.fuel - 1 });
    }
}
