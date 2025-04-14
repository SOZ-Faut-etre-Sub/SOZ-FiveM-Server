import { Gauge } from 'prom-client';

import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';

@Provider()
export class MonitorFiveMObjectProvider {
    private pedCount: Gauge<string> = new Gauge({
        name: 'soz_ped_count',
        help: 'Number of ped',
    });
    private objectCount: Gauge<string> = new Gauge({
        name: 'soz_object_count',
        help: 'Number of object',
    });
    private netObjectCount: Gauge<string> = new Gauge({
        name: 'soz_netobject_count',
        help: 'Number of net object',
    });
    private vehicleCount: Gauge<string> = new Gauge({
        name: 'soz_vehicle_count',
        help: 'Number of vehicle',
    });
    private pickupCount: Gauge<string> = new Gauge({
        name: 'soz_pickup_count',
        help: 'Number of pickup',
    });

    @Tick(5000, 'monitor:fivem-objects:metrics')
    public async onTick() {
        this.pedCount.set(GetGamePool('CPed').length);
        this.objectCount.set(GetGamePool('CObject').length);
        this.netObjectCount.set(GetGamePool('CNetObject').length);
        this.vehicleCount.set(GetGamePool('CVehicle').length);
        this.pickupCount.set(GetGamePool('CPickup').length);
    }
}
