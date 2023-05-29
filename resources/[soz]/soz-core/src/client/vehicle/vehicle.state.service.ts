import { createSelector } from 'reselect';

import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { ServerEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleCondition, VehicleVolatileState } from '../../shared/vehicle/vehicle';

type VehicleStateItem = {
    selectors: any[];
    state: VehicleVolatileState;
};

@Injectable()
export class VehicleStateService {
    private state: Map<number, VehicleStateItem> = new Map<number, VehicleStateItem>();

    private selectorCreators = [];

    public async getVehicleState(vehicleEntityId: number): Promise<VehicleVolatileState> {
        if (this.state.has(vehicleEntityId)) {
            const item = this.state.get(vehicleEntityId);

            return { ...item.state };
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        return await emitRpc<VehicleVolatileState>(RpcServerEvent.VEHICLE_GET_STATE, vehicleNetworkId);
    }

    public async getVehicleCondition(vehicleEntityId: number): Promise<VehicleCondition> {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        return await emitRpc<VehicleCondition>(RpcServerEvent.VEHICLE_GET_CONDITION, vehicleNetworkId);
    }

    public setVehicleState(vehicleEntityId: number, state: VehicleVolatileState, registerState = true): void {
        let item = this.state.get(vehicleEntityId);

        if (!item) {
            const selectors = [];

            for (const creator of this.selectorCreators) {
                selectors.push(creator(vehicleEntityId));
            }

            item = {
                selectors,
                state: state,
            };
        } else {
            item.state = state;
        }

        if (registerState) {
            this.state.set(vehicleEntityId, item);
        }

        item.selectors.forEach(selector => selector(state, vehicleEntityId));
    }

    public deleteVehicleState(vehicleEntityId: number): void {
        this.state.delete(vehicleEntityId);
    }

    public updateVehicleState(
        vehicleEntityId: number,
        state: Partial<VehicleVolatileState>,
        disableSelfSync = true,
        enableAroundSync = false
    ): void {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        // Update state locally has we won't receive the event
        if (this.state.has(vehicleEntityId)) {
            const item = this.state.get(vehicleEntityId);

            item.state = { ...item.state, ...state };
        }

        TriggerServerEvent(
            ServerEvent.VEHICLE_UPDATE_STATE,
            vehicleNetworkId,
            state,
            disableSelfSync,
            enableAroundSync
        );
    }

    public updateVehicleCondition(vehicleEntityId: number, condition: Partial<VehicleCondition>): void {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_CONDITION, vehicleNetworkId, condition);
    }

    public addVehicleStateSelector(
        selectors: ((state: VehicleVolatileState) => any)[],
        method: (...data) => void
    ): void {
        this.selectorCreators.push(vehicleEntityId => {
            return createSelector(selectors, (...data) => {
                return method(vehicleEntityId, ...data);
            });
        });
    }
}
