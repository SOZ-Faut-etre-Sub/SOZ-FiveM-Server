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
            this.objects[object.id] = object;
        }

        TriggerLatentClientEvent(ClientEvent.OBJECT_CREATE, -1, 16 * 1024, objects);
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
        this.addObjects([object]);

        return object.id;
    }

    @Exportable('DeleteObject')
    public deleteObject(id: string): void {
        this.deleteObjects([id]);
    }

    public deleteObjects(ids: string[]): void {
        for (const id of ids) {
            delete this.objects[id];
        }

        TriggerLatentClientEvent(ClientEvent.OBJECT_DELETE, -1, 16 * 1024, ids);
    }

    public getObject(id: string): WorldObject {
        return this.objects[id];
    }

    public updateObject(object: WorldObject) {
        this.objects[object.id] = object;

        TriggerClientEvent(ClientEvent.OBJECT_EDIT, -1, object);
    }
}
