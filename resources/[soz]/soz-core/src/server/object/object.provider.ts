import { Exportable } from '../../core/decorators/exports';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { uuidv4 } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { WorldObject } from '../../shared/object';
import { RpcServerEvent } from '../../shared/rpc';

@Provider()
export class ObjectProvider {
    private objects: Record<string, WorldObject> = {};

    public addObjects(objects: WorldObject[]): void {
        for (const object of objects) {
            this.createObject(object);
        }
    }

    @Rpc(RpcServerEvent.OBJECT_GET_LIST)
    public getObjects(): WorldObject[] {
        return Object.values(this.objects);
    }

    @Exportable('CreateObject')
    public createObjectFromExternal(object: Omit<WorldObject, 'id'>): string {
        const id = uuidv4();
        const worldObject = { ...object, id };

        this.createObject(worldObject);

        return id;
    }

    public createObject(object: WorldObject): string {
        this.objects[object.id] = object;

        TriggerClientEvent(ClientEvent.OBJECT_CREATE, -1, object);

        return object.id;
    }

    @Exportable('DeleteObject')
    public deleteObject(id: string): void {
        delete this.objects[id];
        TriggerClientEvent(ClientEvent.OBJECT_DELETE, -1, id);
    }

    public getObject(id: string): WorldObject {
        return this.objects[id];
    }
}
