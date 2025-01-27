import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { TowRope } from '@public/shared/vehicle/tow.rope';

import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { TowRopeRepository } from '../repository/tow.rope.repository';

@Provider()
export class VehicleTowProvider {
    @Inject(TowRopeRepository)
    public towRopeRepository: TowRopeRepository;

    @Inject(InventoryFactory)
    public inventoryFactory: InventoryFactory;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(Monitor)
    public monitor: Monitor;

    @OnEvent(ServerEvent.VEHICLE_TOW_ROPE_ADD)
    public async addTowRope(source: number, towRope: TowRope, item: string) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.remove(item, 1, false)) {
            return;
        }

        this.towRopeRepository.addRope(towRope);

        this.notifier.notify(source, 'Le cable de remorquage a été ~g~installé~s~');
    }

    public async unregister(vehNetId: number) {
        const towRopes = await this.towRopeRepository.get(rope => rope.netId1 == vehNetId || rope.netId2 == vehNetId);
        for (const towRope of towRopes) {
            this.towRopeRepository.delete(towRope.id);
        }
    }

    @OnEvent(ServerEvent.VEHICLE_TOW_ROPE_DELETE)
    public async deleteTowRope(source: number, id: string) {
        const towRope = await this.towRopeRepository.find(id);
        this.towRopeRepository.delete(id);

        this.notifier.notify(source, 'Le cable de remorquage a été ~r~enlevé~s~');

        const owner1 = NetworkGetEntityOwner(NetworkGetEntityFromNetworkId(towRope.netId1));
        TriggerClientEvent(ClientEvent.VEH_FEATURE_SURFACE_RESET, owner1, towRope.netId1);

        const owner2 = NetworkGetEntityOwner(NetworkGetEntityFromNetworkId(towRope.netId2));
        TriggerClientEvent(ClientEvent.VEH_FEATURE_SURFACE_RESET, owner2, towRope.netId2);
    }
}
