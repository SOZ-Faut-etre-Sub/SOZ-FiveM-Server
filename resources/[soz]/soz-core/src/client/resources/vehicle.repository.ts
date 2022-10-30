import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { RpcEvent } from '../../shared/rpc';
import { Vehicle } from '../../shared/vehicle/vehicle';

@Injectable()
export class VehicleRepository {
    private vehicles: Vehicle[] = [];

    public async load() {
        this.vehicles = await emitRpc(RpcEvent.REPOSITORY_GET_DATA, 'vehicle');
    }

    public update(vehicles: Vehicle[]) {
        this.vehicles = vehicles;
    }

    public get(): Vehicle[] {
        return this.vehicles;
    }

    public getByModelHash(hash: number): Vehicle | null {
        return this.vehicles.find(vehicle => vehicle.hash === hash) || null;
    }
}
