import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { WorldObject } from '../../shared/object';

type SpawnedObject = {
    entity: number;
    object: WorldObject;
};

@Provider()
export class ObjectService {
    private objects: Record<string, SpawnedObject> = {};

    @OnEvent(ClientEvent.OBJECT_CREATE)
    public createObject(id: string, object: WorldObject): void {
        const entity = CreateObjectNoOffset(
            GetHashKey(object.model),
            object.position[0],
            object.position[1],
            object.position[2],
            false,
            false,
            false
        );

        SetEntityHeading(entity, object.position[3]);

        if (object.freeze) {
            FreezeEntityPosition(entity, true);
        }

        this.objects[id] = {
            entity,
            object,
        };
    }

    @OnEvent(ClientEvent.OBJECT_DELETE)
    public deleteObject(id: string): void {
        const object = this.objects[id];

        if (object) {
            if (DoesEntityExist(object.entity)) {
                DeleteEntity(object.entity);
            }

            delete this.objects[id];
        }
    }
}
