import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { Property } from '../../shared/housing/housing';
import { RpcServerEvent } from '../../shared/rpc';

@Injectable()
export class HousingRepository {
    private properties: Property[] = [];

    public async load() {
        this.properties = await emitRpc(RpcServerEvent.REPOSITORY_GET_DATA, 'housing');
    }

    public update(properties: Property[]) {
        this.properties = properties;
    }

    public get(): Property[] {
        return this.properties;
    }
}
