import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { VehicleEntityState } from '../../shared/vehicle/vehicle';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleStateProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @OnEvent(ClientEvent.VEHICLE_UPDATE_STATE)
    public updateVehicleState(vehicleNetworkId: number, state: VehicleEntityState): void {
        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        this.vehicleStateService.setVehicleState(vehicleEntityId, state);
    }
}
