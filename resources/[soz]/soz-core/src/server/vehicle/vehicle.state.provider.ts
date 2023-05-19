import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleCondition, VehicleEntityState } from '../../shared/vehicle/vehicle';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleStateProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Exportable('GetVehicleState')
    @Rpc(RpcServerEvent.VEHICLE_GET_STATE)
    public getVehicleState(source: number, vehicleNetworkId: number): VehicleEntityState {
        return this.vehicleStateService.getVehicleState(vehicleNetworkId);
    }

    @Exportable('UpdateVehicleState')
    @OnEvent(ServerEvent.VEHICLE_UPDATE_STATE)
    public updateVehicleState(source: number, vehicleNetworkId: number, state: Partial<VehicleEntityState>): void {
        this.vehicleStateService.updateVehicleState(vehicleNetworkId, state);
    }

    @Exportable('UpdateVehicleCondition')
    @OnEvent(ServerEvent.VEHICLE_UPDATE_CONDITION)
    public updateVehicleCondition(source: number, vehicleNetworkId: number, condition: VehicleCondition): void {
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);

        this.vehicleStateService.updateVehicleState(vehicleNetworkId, {
            condition: {
                ...state.condition,
                ...condition,
            },
        });
    }
}
