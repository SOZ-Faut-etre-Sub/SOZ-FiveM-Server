import { Injectable } from '../core/decorators/injectable';
import { uuidv4 } from '../core/utils';
import { ClientEvent } from '../shared/event';
import { WorldObject } from '../shared/object';

@Injectable()
export class ObjectService {
    public createObjectForAllPlayer(object: WorldObject): string {
        const id = uuidv4();
        TriggerClientEvent(ClientEvent.OBJECT_CREATE, -1, id, object);

        return id;
    }

    public deleteObjectForAllPlayer(id: string): void {
        TriggerClientEvent(ClientEvent.OBJECT_DELETE, -1, id);
    }
}
