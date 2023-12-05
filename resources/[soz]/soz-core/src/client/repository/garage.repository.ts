import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { RpcServerEvent } from '../../shared/rpc';
import { Garage } from '../../shared/vehicle/garage';

@Injectable()
export class GarageRepository {
    private garages: Record<string, Garage> = {};

    public async load() {
        this.garages = await emitRpc(RpcServerEvent.REPOSITORY_GET_DATA, 'garage');
    }

    public update(garages: Record<string, Garage>) {
        this.garages = garages;
    }

    public get(): Record<string, Garage> {
        return this.garages;
    }
}
