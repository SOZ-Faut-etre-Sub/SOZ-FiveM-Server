import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { FuelStation } from '../../shared/fuel';
import { RpcEvent } from '../../shared/rpc';

@Injectable()
export class FuelStationRepository {
    private fuelStations: Record<string, FuelStation> = {};

    public async load() {
        this.fuelStations = await emitRpc(RpcEvent.REPOSITORY_GET_DATA, 'fuelStation');
    }

    public update(garages: Record<string, FuelStation>) {
        this.fuelStations = garages;
    }

    public get(): Record<string, FuelStation> {
        return this.fuelStations;
    }

    public find(name: string): FuelStation | undefined {
        return this.fuelStations[name];
    }
}
