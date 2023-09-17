import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent } from '@public/shared/event';
import {
    PropClientData,
    PropCollection,
    PropState,
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

    private objectsByChunk = new Map<number, Record<string, WorldPlacedProp>>();

    private currentChunks: number[] = [];

    // Prop Creation / Deletion

    private async createProp(object: WorldPlacedProp): Promise<string> {
        const chunk = getChunkId(object.position);

        if (!this.objectsByChunk.has(chunk)) {
            this.objectsByChunk.set(chunk, {});
        }

        // Don't create duplicate props
        if (this.objectsByChunk.get(chunk)[object.unique_id]) {
            return object.unique_id;
        }

        this.objectsByChunk.get(chunk)[object.unique_id] = object;

        if (this.currentChunks.includes(chunk)) {
            await this.spawnProp(object);
        }

        return object.unique_id;
    }

    private async deleteProp(object: WorldPlacedProp): Promise<boolean> {
        const chunk = getChunkId(object.position);

        if (!this.objectsByChunk.has(chunk)) {
            return false;
        }

        if (!this.objectsByChunk.get(chunk)[object.unique_id]) {
            return false;
        }

        if (this.loadedProps[object.unique_id]) {
            await this.despawnProp(object.unique_id);
        }

        delete this.objectsByChunk.get(chunk)[object.unique_id];
        return true;
    }

    // Prop Spawning / Despawning

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
            ...prop,
            entity: entity,
            state: PropState.loaded,
        };

        return entity;
    }

    private async despawnProp(uniqueId: string): Promise<boolean> {
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

    public async resetProp(prop: SpawedWorlPlacedProp): Promise<void> {
        const entity = prop.entity;
        if (!DoesEntityExist(entity)) {
            return;
        }
        SetEntityCoordsNoOffset(entity, prop.position[0], prop.position[1], prop.position[2], false, false, false);
        SetEntityHeading(entity, prop.position[3]);

        if (prop.matrix) {
            this.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true);
    }

    // Player Loading / Stoping / Chunk Change

    @Once(OnceStep.PlayerLoaded)
    public async onStart() {
        const loadedProps = await emitRpc<WorldPlacedProp[]>(RpcServerEvent.PROP_GET_LOADED_PROPS);
        for (const prop of loadedProps) {
            this.createProp(prop);
        }
    }

    @Once(OnceStep.Stop)
    public async despawnAllProps(): Promise<void> {
        for (const object of Object.keys(this.loadedProps)) {
            await this.despawnProp(object);
        }
    }

    public async deleteAllProps(): Promise<void> {
        for (const object of Object.values(this.loadedProps)) {
            await this.deleteProp(object);
        }
        this.objectsByChunk.clear();
    }

    public async updateSpawnPropOnGridChange(grid: number[]) {
        // Close hammer menu to avoid bugs
        TriggerEvent(ClientEvent.PROP_ON_GRID_CHANGE);

        const removedChunks = this.currentChunks.filter(chunk => !grid.includes(chunk));
        const addedChunks = grid.filter(chunk => !this.currentChunks.includes(chunk));

        this.currentChunks = grid;

        // Unload objects from removed chunks
        for (const chunk of removedChunks) {
            if (this.objectsByChunk.has(chunk)) {
                for (const prop of Object.values(this.objectsByChunk.get(chunk))) {
                    await this.despawnProp(prop.unique_id);
                }
            }
        }

        // Load objects from added chunks
        for (const chunk of addedChunks) {
            if (this.objectsByChunk.has(chunk)) {
                for (const prop of Object.values(this.objectsByChunk.get(chunk))) {
                    await this.spawnProp(prop);
                }
            }
        }
    }

    // Server Events

    @OnEvent(ClientEvent.PROP_SYNC_CLIENTSIDE)
    public async syncPropClientSide() {
        await this.deleteAllProps();

        const loadProps = await emitRpc<WorldPlacedProp[]>(RpcServerEvent.PROP_GET_LOADED_PROPS);
        for (const prop of loadProps) {
            await this.createProp(prop);
        }
    }

    @OnEvent(ClientEvent.PROP_CREATE_CLIENTSIDE)
    public async createClientSideProp(props: WorldPlacedProp[], exclude: number[] = []) {
        const serverId = GetPlayerServerId(PlayerId());
        if (exclude.includes(serverId)) {
            return;
        }

        for (const prop of props) {
            await this.createProp(prop);
        }
    }

    @OnEvent(ClientEvent.PROP_DELETE_CLIENTSIDE)
    public async deleteClientSideProp(props: WorldPlacedProp[], exclude: number[] = []) {
        const serverId = GetPlayerServerId(PlayerId());
        if (exclude.includes(serverId)) {
            return;
        }

        for (const prop of props) {
            await this.deleteProp(prop);
        }
    }

    @OnEvent(ClientEvent.PROP_EDIT_CLIENTSIDE)
    public async editClientSideProp(oldObject: WorldPlacedProp, newObject: WorldPlacedProp, exclude: number[] = []) {
        const serverId = GetPlayerServerId(PlayerId());
        if (exclude.includes(serverId)) {
            return;
        }

        const result = await this.deleteProp(oldObject);

        if (result) {
            await this.createProp(newObject);
        }
    }

    // Getters

    public getPropClientData(): PropClientData {
        let total = 0;
        this.objectsByChunk.forEach(chunk => (total += Object.keys(chunk).length));
        return {
            total: total,
            chunk: Object.keys(this.loadedProps).length,
        };
    }

    public getProp(uniqueId: string): SpawedWorlPlacedProp {
        return this.loadedProps[uniqueId];
    }

    // Debug Prop Managment

    public async spawnDebugProp(prop: WorldPlacedProp, onGround: boolean, state: PropState): Promise<number> {
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
            ...prop,
            entity: entity,
            state: state,
        };
        return entity;
    }

    public async despawnDebugProp(prop: SpawedWorlPlacedProp): Promise<void> {
        if (!this.loadedDebugProps[prop.unique_id]) {
            return;
        }

        if (DoesEntityExist(prop.entity)) {
            DeleteEntity(prop.entity);
        }

        delete this.loadedDebugProps[prop.unique_id];
    }

    public async despawnOrResetProp(prop: SpawedWorlPlacedProp): Promise<void> {
        if (prop.state === PropState.unplaced) {
            await this.despawnDebugProp(prop);
        } else {
            await this.resetProp(prop);
        }
    }

    public async despawnAllDebugProps(): Promise<void> {
        for (const object of Object.values(this.loadedDebugProps)) {
            await this.despawnDebugProp(object);
        }
    }

    // Collection management

    public async fetchCollection(collection: PropCollection): Promise<SpawnedCollection> {
        const spawnedCollection: SpawnedCollection = {
            ...collection,
            props: {},
        };

        for (const prop of Object.values(collection.props)) {
            // Fetch already loaded props
            if (this.loadedProps[prop.unique_id]) {
                spawnedCollection.props[prop.unique_id] = {
                    ...prop,
                    entity: this.loadedProps[prop.unique_id].entity,
                    state: PropState.loaded,
                };
            } else {
                // Spawn debug props for unload props
                const entity = await this.spawnDebugProp(prop, false, PropState.placed);
                spawnedCollection.props[prop.unique_id] = {
                    ...prop,
                    entity: entity,
                    state: PropState.placed,
                };
            }
        }

        return spawnedCollection;
    }

    public async despawnDebugPropsOfCollection(collection: SpawnedCollection): Promise<void> {
        for (const prop of Object.values(collection.props)) {
            // Despawn debug props for unload props
            if (this.loadedDebugProps[prop.unique_id]) {
                await this.despawnDebugProp(prop);
            }
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
