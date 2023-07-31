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
    }

    @Rpc(RpcServerEvent.OBJECT_GET_LIST)
    public getObjects(): WorldObject[] {
        return Object.values(this.objects);
    }

    @Exportable('CreateObject')
    public createObject(object: WorldObject & { id?: string }): string {
        if (!object.id) {
            object.id = uuidv4();
        }

        TriggerClientEvent(ClientEvent.OBJECT_CREATE, -1, object);

        return object.id;
    }

    @Exportable('DeleteObject')
    public deleteObject(id: string): void {
        TriggerClientEvent(ClientEvent.OBJECT_DELETE, -1, id);
    }
}
