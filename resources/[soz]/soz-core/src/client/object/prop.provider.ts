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

    private loadedObjects: Record<string, SpawedWorlPlacedProp> = {};

    private objectsByChunk = new Map<number, WorldPlacedProp[]>();

    private currentChunks: number[] = [];

    async createProp(object: WorldPlacedProp): Promise<string> {
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

    @Once(OnceStep.Start)
    public async onStart() {
        const loadedProps = await emitRpc<WorldPlacedProp[]>(RpcServerEvent.PROP_GET_LOADED_PROPS);
        for (const prop of loadedProps) {
            await this.createProp(prop);
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

    public deleteAllObjects(): void {
        this.unloadAllObjects();
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
                for (const object of this.objectsByChunk.get(chunk)) {
                    this.despawnProp(object.unique_id);
                }
            }
        }

        // Load objects from added chunks
        for (const chunk of addedChunks) {
            if (this.objectsByChunk.has(chunk)) {
                for (const object of this.objectsByChunk.get(chunk)) {
                    await this.spawnProp(object);
                }
            }
        }
    }

    // In case the client seems to desync with the server, we provide a function to resync the client
    @OnEvent(ClientEvent.PROP_SYNC_CLIENTSIDE)
    public async syncPropClientSide() {
        const loadProps = await emitRpc<WorldPlacedProp[]>(RpcServerEvent.PROP_GET_LOADED_PROPS);

        this.deleteAllObjects();

        for (const prop of loadProps) {
            await this.createProp(prop);
        }
    }

    @OnEvent(ClientEvent.PROP_CREATE_CLIENTSIDE)
    public async createClientSideProp(props: WorldPlacedProp[]) {
        for (const prop of props) {
            if (this.loadedObjects[prop.unique_id]) {
                // Check if already exists in the world
                if (
                    DoesEntityExist(this.loadedObjects[prop.unique_id].entity) &&
                    GetEntityModel(this.loadedObjects[prop.unique_id].entity) === GetHashKey(prop.model) &&
                    GetClosestObjectOfType(
                        prop.position[0],
                        prop.position[1],
                        prop.position[2],
                        2.0,
                        GetHashKey(prop.model),
                        false,
                        false,
                        false
                    ) === this.loadedObjects[prop.unique_id].entity
                ) {
                    continue;
                } else {
                    // If it does exist, but is not the same model, or not the same entity, despawn it and spawn a new one
                    await this.despawnProp(prop.unique_id);
                }
            }
            await this.spawnProp(prop);
        }
    }

    @OnEvent(ClientEvent.PROP_DELETE_CLIENTSIDE)
    public async deleteClientSideProp(propIds: string[]) {
        for (const propId of propIds) {
            await this.despawnProp(propId);
        }
    }

    @OnEvent(ClientEvent.PROP_EDIT_CLIENTSIDE)
    public async editClientSideProp(prop: WorldPlacedProp) {
        await this.editProp(prop.unique_id, prop);
    }

    private async spawnProp(prop: WorldPlacedProp): Promise<number> {
        if (this.loadedObjects[prop.unique_id]) {
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

        this.loadedObjects[prop.unique_id] = {
            entity,
            ...prop,
        };
        return entity;
    }

    private async despawnProp(uniqueId: string): Promise<boolean> {
        const prop = this.loadedObjects[uniqueId];

        if (!prop) {
            return false;
        }

        if (DoesEntityExist(prop.entity)) {
            DeleteEntity(prop.entity);
        }

        delete this.loadedObjects[uniqueId];
        return true;
    }

    private async editProp(uniqueId: string, prop: WorldPlacedProp): Promise<boolean> {
        if (!DoesEntityExist(this.loadedObjects[uniqueId].entity)) {
            return false;
        }

        const entity = this.loadedObjects[uniqueId].entity;

        SetEntityCoordsNoOffset(entity, prop.position[0], prop.position[1], prop.position[2], false, false, false);
        SetEntityHeading(entity, prop.position[3]);

        if (prop.matrix) {
            this.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityCollision(entity, prop.collision, false);
        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true); // Always freeze for the moment

        this.loadedObjects[uniqueId] = {
            ...prop,
            entity,
        };
    }

    public getPropClientData(): PropClientData {
        return {
            total: Object.keys(this.loadedObjects).length,
            valid: Object.keys(this.loadedObjects).filter(key => DoesEntityExist(this.loadedObjects[key].entity))
                .length,
        };
    }

    public async spawnDebugProp(prop: WorldPlacedProp, onGround: boolean): Promise<number> {
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
        if (prop.loaded) {
            if (!this.loadedObjects[prop.unique_id]) {
                // The prop should be loaded, but is not for this client. It shouldn't happen
                console.error(`[PropProvider] Prop ${prop.unique_id} is loaded but not spawned. Syncing...`);
                await this.syncPropClientSide();
            }
            await this.editProp(prop.unique_id, this.loadedObjects[prop.unique_id]);
        } else {
            if (DoesEntityExist(prop.entity)) {
                DeleteEntity(prop.entity);
            }
        }
    }

    public async spawnDebugCollection(collection: PropCollection): Promise<SpawnedCollection> {
        const spawnedCollection: SpawnedCollection = {
            ...collection,
            props: {},
        };
        for (const prop of Object.values(collection.props)) {
            let entity: number;
            if (prop.loaded) {
                if (!this.loadedObjects[prop.unique_id]) {
                    // The prop should be loaded, but is not for this client. It shouldn't happen
                    console.error(`[PropProvider] Prop ${prop.unique_id} is loaded but not spawned. Syncing...`);
                    await this.syncPropClientSide();
                    entity = this.loadedObjects[prop.unique_id].entity;
                } else {
                    entity = this.loadedObjects[prop.unique_id].entity;
                    if (!DoesEntityExist(entity)) {
                        // The prop should be loaded, exists for the client, but the entity doesn't exist. It shouldn't happen
                        console.error(`[PropProvider] Prop ${prop.unique_id} is loaded but not spawned. Syncing...`);
                        await this.syncPropClientSide();
                        entity = this.loadedObjects[prop.unique_id].entity;
                    }
                }
                spawnedCollection.props[prop.unique_id] = {
                    ...prop,
                    entity: entity,
                };
            } else {
                entity = await this.spawnDebugProp(prop, false);
                spawnedCollection.props[prop.unique_id] = {
                    ...prop,
                    entity: entity,
                };
            }
        }
        return spawnedCollection;
    }

    public async despawnDebugCollection(spawnedCollection: SpawnedCollection): Promise<void> {
        for (const prop of Object.values(spawnedCollection.props)) {
            await this.despawnDebugProp(prop);
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
