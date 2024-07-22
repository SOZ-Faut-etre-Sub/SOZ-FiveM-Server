import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ServerEvent } from '@public/shared/event';

@Provider()
export class PawlHarvestProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @OnEvent(ServerEvent.PAWL_DECREASE_CHAINSAW_FUEL)
    public async decreaseFuel(source, data) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return;
        }

        inventory.updateMetadataAtSlot(data.slot, { fuel: data.fuel - 1 });
    }
}
