import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { Notifier } from '@public/client/notifier';
import { PlayerService } from '@public/client/player/player.service';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent, ServerEvent } from '@public/shared/event';

@Provider()
export class PawlHarvestProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ClientEvent.PAWL_FAST_HARVEST_TREE)
    public fastHarvest() {
        const items = this.inventoryManager.getItems();
        const chainsaw = items.find(item => item.name === 'chainsaw');

        if (!chainsaw?.metadata.fuel || chainsaw?.metadata?.fuel < 1) {
            this.notifier.error("Vous n'avez plus de carburant..");
            return;
        }

        TriggerServerEvent(ServerEvent.PAWL_DECREASE_CHAINSAW_FUEL, {
            slot: chainsaw.slot,
            fuel: chainsaw.metadata.fuel,
        });
        TriggerEvent('pawl:client:fastHarvestTree', source);
    }
}
