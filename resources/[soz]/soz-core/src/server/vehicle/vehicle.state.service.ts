import { Injectable } from '@core/decorators/injectable';
import { ClientEvent } from '@public/shared/event';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';

import {
    getDefaultVehicleCondition,
    getDefaultVehicleVolatileState,
    VehicleCondition,
    VehicleVolatileState,
} from '../../shared/vehicle/vehicle';

type VehicleState = {
    volatile: VehicleVolatileState;
    condition: VehicleCondition;
    position: Vector3 | Vector4 | null;
    owner: number;
};

@Injectable()
export class VehicleStateService {
    private state: Map<number, VehicleState> = new Map<number, VehicleState>();

    private vehicleKeys: Record<string, Set<string>> = {};

    public getVehicleState(vehicleNetworkId: number): Readonly<VehicleState> {
        if (this.state.has(vehicleNetworkId)) {
            return this.state.get(vehicleNetworkId);
        }

        return {
            volatile: getDefaultVehicleVolatileState(),
            condition: getDefaultVehicleCondition(),
            owner: null,
            position: null,
        };
    }

    public getStates(): Readonly<Map<number, VehicleState>> {
        return this.state;
    }

    public updateVehiclePosition(vehicleNetworkId: number, position: Vector3): void {
        if (!this.state.has(vehicleNetworkId)) {
            return;
        }

        const state = this.state.get(vehicleNetworkId);
        state.position = position;
    }

    public updateVehicleVolatileState(
        vehicleNetworkId: number,
        state: Partial<VehicleVolatileState>,
        excludeSource: number | null = null,
        forwardToEveryone = false
    ): void {
        const previousState = this.getVehicleState(vehicleNetworkId);

        const newState = {
            volatile: {
                ...previousState.volatile,
                ...state,
            },
            condition: previousState.condition,
            owner: previousState.owner,
            position: previousState.position,
        };

        this.state.set(vehicleNetworkId, newState);

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!entityId) {
            return;
        }

        const owner = NetworkGetEntityOwner(entityId);

        if (!owner) {
            return;
        }

        if (forwardToEveryone) {
            TriggerClientEvent(ClientEvent.VEHICLE_UPDATE_STATE, -1, vehicleNetworkId, newState.volatile, false);
        } else if (owner !== excludeSource) {
            TriggerClientEvent(ClientEvent.VEHICLE_UPDATE_STATE, owner, vehicleNetworkId, newState.volatile);
        }
    }

    // Update vehicle condition from server, propagate to owner
    public updateVehicleCondition(vehicleNetworkId: number, condition: Partial<VehicleCondition>): void {
        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!entityId) {
            return;
        }

        const owner = NetworkGetEntityOwner(entityId);

        if (!owner) {
            return;
        }

        TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_APPLY, owner, vehicleNetworkId, condition);

        // Also sync here as owner will not send back to server (same diff)
        this.updateVehicleConditionState(vehicleNetworkId, condition);
    }

    public updateVehicleConditionState(vehicleNetworkId: number, condition: Partial<VehicleCondition>): void {
        const previousState = this.getVehicleState(vehicleNetworkId);

        const newState = {
            volatile: previousState.volatile,
            condition: {
                ...previousState.condition,
                ...condition,
            },
            owner: previousState.owner,
            position: previousState.position,
        };

        this.state.set(vehicleNetworkId, newState);
    }

    public register(
        netId: number,
        owner: number,
        position: Vector3 | Vector4,
        volatile: VehicleVolatileState,
        condition: VehicleCondition
    ) {
        this.state.set(netId, {
            volatile,
            condition,
            owner,
            position,
        });

        TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_REGISTER, owner, netId, condition);
    }

    public switchOwner(netId, owner) {
        if (!this.state.has(netId)) {
            return;
        }

        const state = this.state.get(netId);

        TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_UNREGISTER, state.owner, netId);

        this.state.set(netId, {
            ...state,
            owner,
        });

        TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_REGISTER, owner, netId, state.condition);
    }

    public unregister(netId) {
        this.state.delete(netId);
        TriggerClientEvent(ClientEvent.VEHICLE_DELETE_STATE, -1, netId);
        TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_UNREGISTER, -1, netId);
    }

    public hasVehicleKey(vehiclePlate: string, citizenId: string): boolean {
        return this.vehicleKeys[citizenId] && this.vehicleKeys[citizenId].has(vehiclePlate);
    }

    public removeVehicleKey(vehiclePlate: string, citizenId: string): void {
        if (this.vehicleKeys[citizenId]) {
            this.vehicleKeys[citizenId].delete(vehiclePlate);
        }
    }

    public addVehicleKey(vehiclePlate: string, citizenId: string): void {
        if (!this.vehicleKeys[citizenId]) {
            this.vehicleKeys[citizenId] = new Set();
        }

        this.vehicleKeys[citizenId].add(vehiclePlate);
    }

    public getVehicleKeys(citizenId: string): string[] {
        if (!this.vehicleKeys[citizenId]) {
            return [];
        }

        return Array.from(this.vehicleKeys[citizenId]);
    }
}
