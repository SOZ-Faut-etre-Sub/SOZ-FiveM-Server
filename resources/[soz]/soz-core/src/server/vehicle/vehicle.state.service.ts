import { Injectable } from '@core/decorators/injectable';
import { ClientEvent } from '@public/shared/event';

import { getDefaultVehicleState, VehicleCondition, VehicleEntityState } from '../../shared/vehicle/vehicle';

@Injectable()
export class VehicleStateService {
    private spawned: Set<number> = new Set();

    private state: Map<number, VehicleEntityState> = new Map<number, VehicleEntityState>();

    private vehicleKeys: Record<string, Set<string>> = {};

    public getVehicleState(vehicleNetworkId: number): VehicleEntityState {
        return this.state.get(vehicleNetworkId) || getDefaultVehicleState();
    }

    public updateVehicleState(vehicleNetworkId: number, state: Partial<VehicleEntityState>): void {
        const previousState = this.state.get(vehicleNetworkId) || getDefaultVehicleState();

        this.state.set(vehicleNetworkId, {
            ...previousState,
            ...state,
        });

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!entityId) {
            return;
        }

        const owner = NetworkGetEntityOwner(entityId);

        if (!owner) {
            return;
        }

        TriggerClientEvent(ClientEvent.VEHICLE_UPDATE_STATE, owner, vehicleNetworkId, state);
    }

    public updateVehicleCondition(vehicleNetworkId: number, condition: Partial<VehicleCondition>): void {
        const previousState = this.getVehicleState(vehicleNetworkId);

        this.updateVehicleState(vehicleNetworkId, {
            condition: {
                ...previousState.condition,
                ...condition,
            },
        });
    }

    public deleteVehicleState(vehicleNetworkId: number): void {
        this.state.delete(vehicleNetworkId);
    }

    public getSpawned(): number[] {
        return Array.from(this.spawned);
    }

    public registerSpawned(netId: number): void {
        this.spawned.add(netId);
    }

    public unregisterSpawned(netId: number): void {
        this.spawned.delete(netId);
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
