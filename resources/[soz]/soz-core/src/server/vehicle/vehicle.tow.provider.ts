import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ServerEvent } from '@public/shared/event';
import { TowRope } from '@public/shared/vehicle/tow.rope';

import { InventoryManager } from '../inventory/inventory.manager';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { TowRopeRepository } from '../repository/tow.rope.repository';

@Provider()
export class VehicleTowProvider {
    @Inject(TowRopeRepository)
    public towRopeRepository: TowRopeRepository;

    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(Monitor)
    public monitor: Monitor;

    @OnEvent(ServerEvent.VEHICLE_TOW_ROPE_ADD)
    public addTowRope(source: number, towRope: TowRope) {
        if (!this.inventoryManager.removeItemFromInventory(source, 'tow_cable')) {
            return;
        }

        this.towRopeRepository.addRope(towRope);

        this.notifier.notify(source, 'Le cable de remorquage a été ~g~installé~s~');

        this.monitor.publish(
            'tow_rope_add',
            {
                player_source: source,
            },
            {
                data: towRope,
            }
        );
    }

    public async unregister(vehNetId: number) {
        const towRopes = await this.towRopeRepository.get(rope => rope.netId1 == vehNetId || rope.netId2 == vehNetId);
        for (const towRope of towRopes) {
            this.towRopeRepository.delete(towRope.id);
            this.monitor.publish(
                'tow_rope_remove',
                {
                    player_source: source,
                },
                {
                    data: towRope,
                }
            );
        }
    }

    @OnEvent(ServerEvent.VEHICLE_TOW_ROPE_DELETE)
    public deleteTowRope(source: number, id: string) {
        const towRope = this.towRopeRepository.find(id);
        this.towRopeRepository.delete(id);

        this.notifier.notify(source, 'Le cable de remorquage a été ~r~enlevé~s~');

        this.monitor.publish(
            'tow_rope_remove',
            {
                player_source: source,
            },
            {
                data: towRope,
            }
        );
    }
}
