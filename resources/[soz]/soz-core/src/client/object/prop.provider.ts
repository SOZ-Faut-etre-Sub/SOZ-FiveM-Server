import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent } from '@public/shared/event';
import {
    PropClientData,
    PropCollection,
    SpawedWorlPlacedProp,
    SpawnedCollection,
    WorldPlacedProp,
} from '@public/shared/object';
import { RpcServerEvent } from '@public/shared/rpc';

import { getChunkId } from '../../shared/grid';
import { ResourceLoader } from '../resources/resource.loader';

@Provider()
export class PropProvider {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private loadedProps: Record<string, SpawedWorlPlacedProp> = {};
    private loadedDebugProps: Record<string, SpawedWorlPlacedProp> = {};

    private objectsByChunk = new Map<number, WorldPlacedProp[]>();

    private currentChunks: number[] = [];

    // Prop management
    private async createProp(object: WorldPlacedProp): Promise<string> {
        const chunk = getChunkId(object.position);

        if (!this.objectsByChunk.has(chunk)) {
            this.objectsByChunk.set(chunk, []);
        }

        this.objectsByChunk.get(chunk).push(object);

        if (this.currentChunks.includes(chunk)) {
            await this.spawnProp(object);
        }

        return object.unique_id;
    }

    private async deleteProp(uniqueId: string): Promise<boolean> {
        const prop = this.loadedProps[uniqueId];

        if (!prop) {
            return false;
        }

        if (DoesEntityExist(prop.entity)) {
            DeleteEntity(prop.entity);
        }

        delete this.loadedProps[uniqueId];
        return true;
    }

    @Once(OnceStep.PlayerLoaded)
    public async onStart() {
        const loadedProps = await emitRpc<WorldPlacedProp[]>(RpcServerEvent.PROP_GET_LOADED_PROPS);
        for (const prop of loadedProps) {
            this.createProp(prop);
        }
    }

    @Once(OnceStep.Stop)
    public async unloadAllProps(): Promise<void> {
        for (const object of Object.values(this.loadedProps)) {
            await this.deleteProp(object.unique_id);
        }
    }

    public async deleteAllProps(): Promise<void> {
        await this.unloadAllProps();

        this.objectsByChunk.clear();
        this.currentChunks = [];
    }

    public async updateSpawnPropOnGridChange(grid: number[]) {
        const removedChunks = this.currentChunks.filter(chunk => !grid.includes(chunk));
        const addedChunks = grid.filter(chunk => !this.currentChunks.includes(chunk));

        this.currentChunks = grid;

        // Unload objects from removed chunks
        for (const chunk of removedChunks) {
            if (this.objectsByChunk.has(chunk)) {
                for (const prop of this.objectsByChunk.get(chunk)) {
                    await this.deleteProp(prop.unique_id);
                }
            }
        }

        // Load objects from added chunks
        for (const chunk of addedChunks) {
            if (this.objectsByChunk.has(chunk)) {
                for (const prop of this.objectsByChunk.get(chunk)) {
                    await this.spawnProp(prop);
                }
            }
        }
    }

    // In case the client seems to desync with the server, we provide a function to resync the client
    @OnEvent(ClientEvent.PROP_SYNC_CLIENTSIDE)
    public async syncPropClientSide() {
        await this.unloadAllProps();

        const loadProps = await emitRpc<WorldPlacedProp[]>(RpcServerEvent.PROP_GET_LOADED_PROPS);
        for (const prop of loadProps) {
            await this.createProp(prop);
        }
    }

    @OnEvent(ClientEvent.PROP_CREATE_CLIENTSIDE)
    public async createClientSideProp(props: WorldPlacedProp[]) {
        for (const prop of props) {
            await this.createProp(prop);
        }
    }

    @OnEvent(ClientEvent.PROP_DELETE_CLIENTSIDE)
    public async deleteClientSideProp(propIds: string[]) {
        for (const propId of propIds) {
            await this.deleteProp(propId);
        }
    }

    private async spawnProp(prop: WorldPlacedProp): Promise<number> {
        if (this.loadedProps[prop.unique_id]) {
            return;
        }

        await this.resourceLoader.loadModel(prop.model);
        const entity = CreateObjectNoOffset(
            GetHashKey(prop.model),
            prop.position[0],
            prop.position[1],
            prop.position[2],
            false,
            false,
            false
        );

        SetEntityHeading(entity, prop.position[3]);

        if (prop.matrix) {
            this.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityCollision(entity, prop.collision, false);
        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true); // Always freeze for the moment

        this.loadedProps[prop.unique_id] = {
            entity,
            ...prop,
        };
        return entity;
    }

    public getPropClientData(): PropClientData {
        return {
            total: Object.keys(this.loadedProps).length,
            valid: Object.keys(this.loadedProps).filter(key => DoesEntityExist(this.loadedProps[key].entity)).length,
        };
    }

    // Collection
    public async spawnCollection(collection: PropCollection): Promise<SpawnedCollection> {
        const spawnedCollection: SpawnedCollection = {
            ...collection,
            props: {},
            uuid: [],
        };

        for (const prop of Object.values(collection.props)) {
            const prop_uuid = await this.createProp(prop);
            spawnedCollection.uuid.push(prop_uuid);
        }

        return spawnedCollection;
    }

    public async despawnCollection(collection: SpawnedCollection): Promise<void> {
        if (!collection.uuid) {
            return;
        }

        for (const uuid of Object.values(collection.uuid)) {
            await this.deleteProp(uuid);
        }
    }

    public async spawnDebugProp(prop: WorldPlacedProp, onGround: boolean): Promise<number> {
        if (this.loadedDebugProps[prop.unique_id]) {
            return;
        }

        await this.resourceLoader.loadModel(prop.model);
        const entity = CreateObjectNoOffset(
            GetHashKey(prop.model),
            prop.position[0],
            prop.position[1],
            prop.position[2],
            false,
            false,
            false
        );

        SetEntityHeading(entity, prop.position[3]);

        if (prop.matrix) {
            this.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityAlpha(entity, 200, false);
        SetEntityCollision(entity, false, false);
        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true); // Always freeze for the moment

        if (onGround) {
            PlaceObjectOnGroundProperly(entity);
        }

        this.loadedDebugProps[prop.unique_id] = {
            entity,
            ...prop,
        };
        return entity;
    }

    public async resetDebugProp(prop: SpawedWorlPlacedProp): Promise<void> {
        // The prop exists in the collection but is not loaded. Reset its position
        const entity = prop.entity;
        SetEntityCoordsNoOffset(entity, prop.position[0], prop.position[1], prop.position[2], false, false, false);
        SetEntityHeading(entity, prop.position[3]);

        if (prop.matrix) {
            this.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true); // Always freeze for the moment
    }

    public async despawnDebugProp(prop: SpawedWorlPlacedProp): Promise<void> {
        if (DoesEntityExist(prop.entity)) {
            DeleteEntity(prop.entity);
        }

        delete this.loadedDebugProps[prop.unique_id];
    }

    // Collection
    public async spawnDebugCollection(collection: PropCollection): Promise<SpawnedCollection> {
        const spawnedCollection: SpawnedCollection = {
            ...collection,
            props: {},
        };
        for (const prop of Object.values(collection.props)) {
            const entity = await this.spawnDebugProp(prop, false);
            spawnedCollection.props[prop.unique_id] = {
                ...prop,
                entity: entity,
            };
        }
        return spawnedCollection;
    }

    public async despawnDebugCollection(spawnedCollection: SpawnedCollection): Promise<void> {
        if (!spawnedCollection.props) {
            return;
        }

        for (const prop of Object.values(spawnedCollection.props)) {
            await this.despawnDebugProp(prop);
        }
    }

    // Utils
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

    public applyEntityNormalizedMatrix = (entity: number, matrix: Float32Array) => {
        const norm_F = Math.sqrt(matrix[0] ** 2 + matrix[1] ** 2);
        SetEntityMatrix(
            entity,
            -matrix[1] / norm_F,
            matrix[0] / norm_F,
            0, // Right
            matrix[0] / norm_F,
            matrix[1] / norm_F,
            0, // Forward
            0,
            0,
            1, // Up
            matrix[12],
            matrix[13],
            matrix[14] // Position
        );
    };
}
