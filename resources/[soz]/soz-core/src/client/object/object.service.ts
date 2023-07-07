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

    public makeEntityMatrix = (entity: number): Float32Array => {
        const [f, r, u, a] = GetEntityMatrix(entity);

        return new Float32Array([r[0], r[1], r[2], 0, f[0], f[1], f[2], 0, u[0], u[1], u[2], 0, a[0], a[1], a[2], 1]);
    };

    public applyEntityMatrix = (entity: number, matrix: Float32Array) => {
        SetEntityMatrix(
            entity,
            matrix[4],
            matrix[5],
            matrix[6], // Right
            matrix[0],
            matrix[1],
            matrix[2], // Forward
            matrix[8],
            matrix[9],
            matrix[10], // Up
            matrix[12],
            matrix[13],
            matrix[14] // Position
        );
    };
}
