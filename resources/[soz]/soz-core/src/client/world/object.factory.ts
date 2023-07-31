import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Logger } from '@core/logger';
import { ResourceLoader } from '@public/client/resources/resource.loader';
import { Store } from '@public/client/store/store';
import { SOZ_CORE_IS_SERVER } from '@public/globals';
import { joaat } from '@public/shared/joaat';
import { WorldObject } from '@public/shared/object';
import { Vector4 } from '@public/shared/polyzone/vector';

type SpawnedObject = {
    entity: number;
    object: WorldObject;
};

const OBJECT_MODELS_NO_FREEZE = [joaat('prop_cardbordbox_03a')];

@Provider()
export class ObjectFactory {
    @Inject(Logger)
    private readonly logger: Logger;

    private objects: number[] = [];

    @Inject('Store')
    private store: Store;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private loadedObjects: Record<string, SpawnedObject> = {};

    private objectsByChunk = new Map<number, WorldObject[]>();

    private currentChunks: number[] = [];

    public create(object: WorldObject) {
        const entity = CreateObjectNoOffset(
            object.model,
            object.position[0],
            object.position[1],
            object.position[2],
            false,
            false,
            false
        );

        if (!entity) {
            this.logger.error(`Failed to create object ${object.model} at ${JSON.stringify(object.position)}`);

            return;
        }

        SetEntityHeading(entity, object.position[3]);

        if (!OBJECT_MODELS_NO_FREEZE.includes(object.model)) {
            FreezeEntityPosition(entity, true);
        }

        this.objects.push(entity);

        return entity;
    }

    private async spawnObject(object: WorldObject) {
        if (this.loadedObjects[object.id]) {
            return;
        }

        await this.resourceLoader.loadModel(object.model);

        const entity = CreateObjectNoOffset(
            object.model,
            object.position[0],
            object.position[1],
            object.position[2],
            false,
            false,
            false
        );

        SetEntityHeading(entity, object.position[3]);

        if (!OBJECT_MODELS_NO_FREEZE.includes(object.model)) {
            FreezeEntityPosition(entity, true);
        }

        this.loadedObjects[object.id] = {
            entity,
            object,
        };

        this.resourceLoader.unloadModel(object.model);
    }

    private unspawnObject(id: string): void {
        const object = this.loadedObjects[id];

        if (object) {
            if (DoesEntityExist(object.entity)) {
                DeleteEntity(object.entity);
            }

            delete this.loadedObjects[id];
        }
    }

    @Once(OnceStep.Stop)
    public stop() {
        for (const object of this.objects) {
            DeleteEntity(object);
        }
    }
}
