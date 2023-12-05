import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Exportable } from '@core/decorators/exports';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { emitRpc } from '@core/rpc';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { wait } from '@public/core/utils';
import { getChunkId, getGridChunks } from '@public/shared/grid';
import { joaat } from '@public/shared/joaat';
import { Vector3 } from '@public/shared/polyzone/vector';
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
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private loadedObjects: Record<string, SpawnedObject> = {};

    private objectsByChunk = new Map<number, WorldObject[]>();

    private currentChunks: number[] = [];

    private disabled = false;

    public getLoadedObjectsCount(): number {
        return Object.keys(this.loadedObjects).length;
    }

    public getObjects(filter?: (object: WorldObject) => boolean): WorldObject[] {
        const objects = [];

        for (const chunk of this.objectsByChunk.values()) {
            for (const object of chunk) {
                if (!filter || filter(object)) {
                    objects.push(object);
                }
            }
        }

        return objects;
    }

    @Once(OnceStep.PlayerLoaded)
    private async setupObjects(): Promise<void> {
        const objects = await emitRpc<WorldObject[]>(RpcServerEvent.OBJECT_GET_LIST);

        for (const object of objects) {
            await this.createObject(object);
        }
    }

    @OnEvent(ClientEvent.OBJECT_CREATE)
    @Exportable('CreateObject')
    public async createObject(object: WorldObject): Promise<string> {
        const chunk = getChunkId(object.position);

        if (!this.objectsByChunk.has(chunk)) {
            this.objectsByChunk.set(chunk, []);
        }

        this.objectsByChunk.get(chunk).push(object);

        if (this.currentChunks.includes(chunk)) {
            await this.spawnObject(object);
        }

        return object.id;
    }

    @Exportable('GetObjectIdFromEntity')
    public getIdFromEntity(entity: number): string | null {
        for (const object of Object.values(this.loadedObjects)) {
            if (object.entity === entity) {
                return object.object.id;
            }
        }

        return null;
    }

    public getEntityFromId(id: string): number | null {
        const object = this.loadedObjects[id];

        if (object) {
            return object.entity;
        }

        return null;
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

    //@StateSelector(state => state.grid)
    public async updateSpawnObjectOnGridChange(grid: number[]) {
        if (this.disabled) {
            return;
        }

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

        if (IsModelValid(object.model)) {
            await this.resourceLoader.loadModel(object.model);
        }

        const entity = CreateObjectNoOffset(
            object.model,
            object.position[0],
            object.position[1],
            object.position[2],
            false,
            false,
            false
        );

        if (!DoesEntityExist(entity)) {
            return;
        }

        SetEntityHeading(entity, object.position[3]);

        if (!OBJECT_MODELS_NO_FREEZE.includes(object.model)) {
            FreezeEntityPosition(entity, true);
        }

        if (object.placeOnGround) {
            PlaceObjectOnGroundProperly_2(entity);
        }

        if (object.rotation) {
            SetEntityRotation(entity, object.rotation[0], object.rotation[1], object.rotation[2], 0, false);
        }

        this.loadedObjects[object.id] = {
            entity,
            object,
        };

        this.resourceLoader.unloadModel(object.model);

        await wait(0);
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

    public disable(): void {
        this.disabled = true;
        this.currentChunks = [];
        for (const id of Object.keys(this.loadedObjects)) {
            this.unspawnObject(id);
        }
    }

    public async enable() {
        this.disabled = false;
        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const newChunks = getGridChunks(position);

        await this.updateSpawnObjectOnGridChange(newChunks);
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
