import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { FieldProvider } from '@public/server/farm/field.provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class FoodHuntProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(FieldProvider)
    private fieldService: FieldProvider;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    private zonesValue: Record<string, number> = {};
    private zonesDespawnTime: Record<string, number> = {};

    @OnEvent(ServerEvent.FOOD_HUNT)
    async onHunt(source: number, zoneId: string) {
        const prevTime = this.zonesDespawnTime[zoneId];
        if (prevTime && Date.now() < prevTime) {
            return;
        }
        if (!this.zonesValue[zoneId]) {
            this.zonesValue[zoneId] = 0;
        }

        this.zonesValue[zoneId]++;
        console.log(zoneId, this.zonesValue[zoneId]);

        if (this.zonesValue[zoneId] >= 10) {
            this.zonesValue[zoneId] = 0;
            this.zonesDespawnTime[zoneId] = Date.now() + 3600_000;
            TriggerClientEvent(ClientEvent.FOOD_HUNT_SYNC, zoneId, this.zonesValue[zoneId]);
        }
    }

    @Rpc(RpcServerEvent.FOOD_HUNT_INIT)
    public async handleNoSpawnZone() {
        return this.zonesDespawnTime;
    }
}
