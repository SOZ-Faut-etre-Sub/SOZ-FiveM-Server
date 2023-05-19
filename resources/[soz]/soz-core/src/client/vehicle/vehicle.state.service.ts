import { createSelector } from 'reselect';

import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { ServerEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleCondition, VehicleEntityState } from '../../shared/vehicle/vehicle';

@Injectable()
export class VehicleStateService {
    private state: Map<number, VehicleEntityState> = new Map<number, VehicleEntityState>();

    private selectors = [];

    public async getVehicleState(vehicleEntityId: number): Promise<VehicleEntityState> {
        if (this.state.has(vehicleEntityId)) {
            return this.state.get(vehicleEntityId);
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        return await emitRpc<VehicleEntityState>(RpcServerEvent.VEHICLE_GET_STATE, vehicleNetworkId);
    }

    public setVehicleState(vehicleEntityId: number, state: VehicleEntityState): void {
        this.state.set(vehicleEntityId, state);
        this.selectors.forEach(selector => selector(state));
    }

    public updateVehicleState(vehicleEntityId: number, state: Partial<VehicleEntityState>): void {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_STATE, vehicleNetworkId, state);
    }

    public updateVehicleCondition(vehicleEntityId: number, condition: Partial<VehicleCondition>): void {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_CONDITION, vehicleNetworkId, condition);
    }

    public addVehicleStateSelector<R>(selector: (state: VehicleEntityState) => R, method: (data: R) => void): void {
        this.selectors.push(createSelector(selector, method));
    }
}
