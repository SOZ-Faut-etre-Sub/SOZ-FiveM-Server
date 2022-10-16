import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class VehicleStateService {
    private spawned: Set<number> = new Set();

    private vehicleKeys: Record<string, Set<string>> = {};

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
