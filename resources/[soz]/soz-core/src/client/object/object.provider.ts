import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Exportable } from '@core/decorators/exports';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { emitRpc } from '@core/rpc';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { Command } from '@public/core/decorators/command';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { getChunkId, getGridChunks } from '@public/shared/grid';
import { joaat } from '@public/shared/joaat';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { ClientEvent, ServerEvent } from '../../shared/event';
import { WorldObject } from '../../shared/object';
import { Notifier } from '../notifier';

type SpawnedObject = {
    entity: number;
    object: WorldObject;
};

const OBJECT_MODELS_NO_FREEZE = [joaat('prop_cardbordbox_03a')];

const HalloweenMapping: Record<number, number> = {
    [GetHashKey('soz_prop_bb_bin')]: GetHashKey('soz_hw_bin_1'),
    [GetHashKey('soz_prop_bb_bin_hs2')]: GetHashKey('soz_hw_bin_2'),
    [GetHashKey('soz_prop_bb_bin_hs3')]: GetHashKey('soz_hw_bin_3'),
};

@Provider()
export class ObjectProvider {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(Notifier)
    private notifier: Notifier;

    private loadedObjects: Record<string, SpawnedObject> = {};

    private objectsByChunk = new Map<number, WorldObject[]>();

    private currentChunks: number[] = [];

    private disabled = false;
    private ready = false;

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

    public collectObject(entity: number): void {
        const id = this.getIdFromEntity(entity);

        if (id) {
            TriggerServerEvent(ServerEvent.OBJECT_COLLECT, id);
        }
    }

    @Once(OnceStep.PlayerLoaded)
    private async setupObjects(): Promise<void> {
        const objects = await emitRpc<WorldObject[]>(RpcServerEvent.OBJECT_GET_LIST);

        for (const object of objects) {
            await this.createObject(object);
        }
        this.ready = true;
    }

    public isReady() {
        return this.ready;
    }

    @OnEvent(ClientEvent.OBJECT_CREATE)
    public async createObjects(objects: WorldObject[]) {
        for (const object of objects) {
            await this.createObject(object);
        }
    }

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

    @OnEvent(ClientEvent.OBJECT_EDIT)
    public async editObject(object: WorldObject) {
        this.deleteObject(object.id);
        await wait(0);
        this.createObject(object);
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
    public deleteObjects(ids: string[]): void {
        for (const id of ids) {
            this.deleteObject(id);
        }
    }

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

        let model = object.model;
        if (isFeatureEnabled(Feature.Halloween)) {
            model = HalloweenMapping[model] || model;
        }

        if (IsModelValid(model)) {
            if (!(await this.resourceLoader.loadModel(object.model))) {
                return;
            }
        } else {
            console.log(`Model ${model} is not valid for ${object.id}`);
            return;
        }

        let entity = CreateObjectNoOffset(
            model,
            object.position[0],
            object.position[1],
            object.position[2],
            false,
            false,
            false
        );

        if (!DoesEntityExist(entity)) {
            console.log('Failed to create prop, retrying', object.id);
            await wait(10);
            entity = CreateObjectNoOffset(
                model,
                object.position[0],
                object.position[1],
                object.position[2],
                false,
                false,
                false
            );

            if (!DoesEntityExist(entity)) {
                console.log('Failed to create prop even after retry', object.id);
                this.resourceLoader.unloadModel(model);

                return;
            }
        }

        this.resourceLoader.unloadModel(model);

        SetEntityHeading(entity, object.position[3]);

        if (object.matrix) {
            this.applyEntityMatrix(entity, object.matrix);
        }

        if (!OBJECT_MODELS_NO_FREEZE.includes(model)) {
            FreezeEntityPosition(entity, true);
        }

        if (object.placeOnGround) {
            PlaceObjectOnGroundProperly_2(entity);
        }

        if (object.rotation) {
            SetEntityRotation(entity, object.rotation[0], object.rotation[1], object.rotation[2], 0, false);
        }

        SetEntityCollision(entity, !object.noCollision, false);
        SetEntityInvincible(entity, true);

        this.loadedObjects[object.id] = {
            entity,
            object,
        };

        await wait(0);
    }

    private unspawnObject(id: string): void {
        const object = this.loadedObjects[id];

        if (object) {
            if (DoesEntityExist(object.entity)) {
                let model = object.object.model;
                if (isFeatureEnabled(Feature.Halloween)) {
                    model = HalloweenMapping[model] || model;
                }

                if (GetEntityModel(object.entity) == model) {
                    DeleteEntity(object.entity);
                } else {
                    this.notifier.error(
                        `Attemp to delete an entity of wrong model ${GetEntityModel(object.entity)} expected ${model}`
                    );
                }
            } else {
                this.notifier.error('Attemp to delete an non existing entity');
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

    public applyEntityMatrix(entity: number, matrix: Float32Array) {
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
    }

    @Tick(30000, 'object-spawn-check')
    public async objectSpawnCheck() {
        for (const obj of Object.values(this.loadedObjects)) {
            if (!DoesEntityExist(obj.entity)) {
                console.log('object-spawn-check: missing entity, trying to fix it', obj.object.id);
                delete this.loadedObjects[obj.object.id];
                this.spawnObject(obj.object);
            }
        }
    }

    @Command('props')
    public async listprops() {
        const [isAllowed] = await emitRpc<[boolean, string]>(RpcServerEvent.ADMIN_IS_ALLOWED);
        const propsIds = Object.keys(this.loadedObjects).filter(id => isAllowed || !id.includes('drug_seedling'));

        console.log(propsIds);
    }
}
