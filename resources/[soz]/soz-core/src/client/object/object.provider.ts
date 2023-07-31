import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { emitRpc } from '@core/rpc';
import { ResourceLoader } from '@public/client/resources/resource.loader';
import { StateSelector, Store } from '@public/client/store/store';
import { getChunkId } from '@public/shared/grid';
import { joaat } from '@public/shared/joaat';
import { RpcServerEvent } from '@public/shared/rpc';

import { ClientEvent } from '../../shared/event';
import { WorldObject } from '../../shared/object';

type SpawnedObject = {
    entity: number;
    object: WorldObject;
};

const OBJECT_MODELS_NO_FREEZE = [joaat('prop_cardbordbox_03a')];

@Provider()
export class ObjectProvider {
    @Inject('Store')
    private store: Store;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private loadedObjects: Record<string, SpawnedObject> = {};

    private objectsByChunk = new Map<number, WorldObject[]>();

    private currentChunks: number[] = [];

    @Once(OnceStep.PlayerLoaded)
    private async setupObjects(): Promise<void> {
        const objects = await emitRpc<WorldObject[]>(RpcServerEvent.OBJECT_GET_LIST);

        for (const object of objects) {
            await this.createObject(object);
        }
    }

    @OnEvent(ClientEvent.OBJECT_CREATE)
    public async createObject(object: WorldObject) {
        const chunk = getChunkId(object.position);

        if (!this.objectsByChunk.has(chunk)) {
            this.objectsByChunk.set(chunk, []);
        }

        this.objectsByChunk.get(chunk).push(object);

        if (this.currentChunks.includes(chunk)) {
            await this.spawnObject(object);
        }
    }

    @OnEvent(ClientEvent.OBJECT_DELETE)
    public deleteObject(id: string): void {
        for (const [chunk, objects] of this.objectsByChunk.entries()) {
            this.objectsByChunk.set(
                chunk,
                objects.filter(object => object.id !== id)
            );

            if (Object.keys(objects).length === 0) {
                this.objectsByChunk.delete(chunk);
            }
        }

        this.unspawnObject(id);
    }

    @StateSelector(state => state.grid)
    private async updateSpawnObjectOnGridChange(grid: number[]) {
        const removedChunks = this.currentChunks.filter(chunk => !grid.includes(chunk));
        const addedChunks = grid.filter(chunk => !this.currentChunks.includes(chunk));

        this.currentChunks = grid;

        // Unload objects from removed chunks
        for (const chunk of removedChunks) {
            if (this.objectsByChunk.has(chunk)) {
                for (const object of this.objectsByChunk.get(chunk)) {
                    this.unspawnObject(object.id);
                }
            }
        }

        // Load objects from added chunks
        for (const chunk of addedChunks) {
            if (this.objectsByChunk.has(chunk)) {
                for (const object of this.objectsByChunk.get(chunk)) {
                    await this.spawnObject(object);
                }
            }
        }
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
    public unloadAllObjects(): void {
        for (const object of Object.values(this.loadedObjects)) {
            if (DoesEntityExist(object.entity)) {
                DeleteEntity(object.entity);
            }
        }

        this.loadedObjects = {};
    }
}
