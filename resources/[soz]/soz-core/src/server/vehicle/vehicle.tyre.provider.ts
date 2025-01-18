import { Provider } from '@core/decorators/provider';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Monitor } from '@public/server/monitor/monitor';
import { VehicleStateService } from '@public/server/vehicle/vehicle.state.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';

@Provider()
export class VehicleTyreProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.VEHICLE_BURST_TYRE_TO_OWNER)
    public async onVehicleBurstTypeToOwner(source: number, vehNetId: number, index: number) {
        const entityId = NetworkGetEntityFromNetworkId(vehNetId);
        const owner = NetworkGetEntityOwner(entityId);
        if (!owner) {
            return;
        }

        const state = this.vehicleStateService.getVehicleState(vehNetId);
        this.monitor.traceEvent('burst_tire', {
            player_source: source,
            vehicle_plate: state.volatile.plate,
        });
        TriggerClientEvent(ClientEvent.VEHICLE_BURST_TYRE, owner, vehNetId, index);
    }
}
