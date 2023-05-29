import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleCondition, VehicleVolatileState } from '../../shared/vehicle/vehicle';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleStateProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Exportable('GetVehicleState')
    @Rpc(RpcServerEvent.VEHICLE_GET_STATE)
    public getVehicleState(source: number, vehicleNetworkId: number): VehicleVolatileState {
        return this.vehicleStateService.getVehicleState(vehicleNetworkId).volatile;
    }

    @Exportable('GetVehicleState')
    @Rpc(RpcServerEvent.VEHICLE_GET_CONDITION)
    public getVehicleCondition(source: number, vehicleNetworkId: number): VehicleCondition {
        return this.vehicleStateService.getVehicleState(vehicleNetworkId).condition;
    }

    @OnEvent(ServerEvent.VEHICLE_UPDATE_STATE)
    public updateVehicleState(
        source: number,
        vehicleNetworkId: number,
        state: Partial<VehicleVolatileState>,
        disableSync = true,
        forwardToEveryone = false
    ): void {
        this.vehicleStateService.updateVehicleVolatileState(
            vehicleNetworkId,
            state,
            disableSync ? source : null,
            forwardToEveryone
        );
    }

    @OnEvent(ServerEvent.VEHICLE_UPDATE_CONDITION)
    public updateVehicleCondition(
        source: number,
        vehicleNetworkId: number,
        condition: Partial<VehicleCondition>
    ): void {
        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, condition);
    }

    @OnEvent(ServerEvent.VEHICLE_UPDATE_CONDITION_FROM_OWNER)
    public updateVehicleConditionFromOwner(
        source: number,
        vehicleNetworkId: number,
        condition: Partial<VehicleCondition>
    ): void {
        this.vehicleStateService.updateVehicleConditionState(vehicleNetworkId, condition);
    }
}
