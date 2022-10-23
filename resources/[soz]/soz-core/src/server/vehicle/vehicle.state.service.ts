import { Injectable } from '../../core/decorators/injectable';
import { getDefaultVehicleState, VehicleEntityState } from '../../shared/vehicle';

@Injectable()
export class VehicleStateService {
    private spawned: Set<number> = new Set();

    private vehicleKeys: Record<string, Set<string>> = {};

    public getVehicleState(vehicle: number): VehicleEntityState {
        const state = Entity(vehicle).state;
        const defaultState = getDefaultVehicleState();
        const returnState = {};

        for (const key of Object.keys(defaultState)) {
            returnState[key] = state[key] || defaultState[key];
        }

        return returnState as VehicleEntityState;
    }

    public updateVehicleState(vehicle: number, state: Partial<VehicleEntityState>): void {
        for (const [key, value] of Object.entries(state)) {
            Entity(vehicle).state.set(key, value, true);
        }
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
