import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { WorldObject } from '../../shared/object';
import { RpcServerEvent } from '../../shared/rpc';

@Injectable()
export class ObjectRepository {
    private objects: WorldObject[] = [];

    public async load() {
        this.objects = await emitRpc<WorldObject[]>(RpcServerEvent.REPOSITORY_GET_DATA, 'object');
    }

    public update(objects: WorldObject[]) {
        this.objects = objects;
    }

    public get(): WorldObject[] {
        return this.objects;
    }

    public find(id: number): WorldObject | null {
        return this.objects.find(object => object.id === id) || null;
    }
}
