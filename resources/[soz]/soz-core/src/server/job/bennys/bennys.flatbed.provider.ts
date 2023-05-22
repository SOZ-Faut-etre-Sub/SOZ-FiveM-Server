import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

@Provider()
export class BennysFlatbedProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @OnEvent(ServerEvent.BENNYS_FLATBED_ATTACH_VEHICLE)
    public setAttachedVehicle(source: number, flatbedNetworkId: number, attachedNetworkId: number) {
        this.vehicleStateService.updateVehicleState(flatbedNetworkId, {
            flatbedAttachedVehicle: attachedNetworkId,
        });
    }

    @OnEvent(ServerEvent.BENNYS_FLATBED_DETACH_VEHICLE)
    public detachVehicle(source: number, flatbedNetworkId: number) {
        this.vehicleStateService.updateVehicleState(flatbedNetworkId, {
            flatbedAttachedVehicle: null,
        });
    }
}
