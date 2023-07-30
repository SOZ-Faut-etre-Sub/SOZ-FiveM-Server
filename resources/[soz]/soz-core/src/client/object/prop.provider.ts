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
import { getDistance } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { ResourceLoader } from '../resources/resource.loader';
import { ObjectService } from './object.service';

@Provider()
export class PropProvider {
    @Inject(ObjectService)
    private objectService: ObjectService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private objects: Record<string, SpawedWorlPlacedProp> = {}; // unique_ID -> SpawnedWorldPlacedProp

    @Once(OnceStep.Start)
    public async onStart() {
        const loadedProps = await emitRpc<WorldPlacedProp[]>(RpcServerEvent.PROP_GET_LOADED_PROPS);
        for (const prop of loadedProps) {
            await this.spawnProp(prop);
        }
    }

    // In case the client seems to desync with the server, we provide a function to resync the client
    @OnEvent(ClientEvent.PROP_SYNC_CLIENTSIDE)
    public async syncPropClientSide() {
        const loadProps = await emitRpc<WorldPlacedProp[]>(RpcServerEvent.PROP_GET_LOADED_PROPS);

        // Pass over the spawned props and check they exist for the server
        for (const prop of Object.values(this.objects)) {
            // If the prop is not in the loaded props, despawn it
            const loaded_prop = loadProps.find(p => p.unique_id === prop.unique_id);
            if (!loaded_prop) {
                await this.despawnProp(prop.unique_id);
                continue;
            }
            if (!DoesEntityExist(prop.entity) || loaded_prop.model !== prop.model) {
                await this.despawnProp(prop.unique_id);
                await this.spawnProp(loaded_prop);
                continue;
            }
            if (getDistance(loaded_prop.position, prop.position) > 0.2) {
                await this.editProp(prop.unique_id, loaded_prop);
                continue;
            }
        }

        // Pass over the loaded props and check they exist for the client
        for (const prop of loadProps) {
            if (!this.objects[prop.unique_id]) {
                await this.spawnProp(prop);
            }
        }
    }

    @OnEvent(ClientEvent.PROP_CREATE_CLIENTSIDE)
    public async createClientSideProp(props: WorldPlacedProp[]) {
        for (const prop of props) {
            if (this.objects[prop.unique_id]) {
                // Check if already exists in the world
                if (
                    DoesEntityExist(this.objects[prop.unique_id].entity) &&
                    GetEntityModel(this.objects[prop.unique_id].entity) === GetHashKey(prop.model) &&
                    GetClosestObjectOfType(
                        prop.position[0],
                        prop.position[1],
                        prop.position[2],
                        2.0,
                        GetHashKey(prop.model),
                        false,
                        false,
                        false
                    ) === this.objects[prop.unique_id].entity
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
            if (this.objects[propId]) {
                await this.despawnProp(propId);
            }
        }
    }

    @OnEvent(ClientEvent.PROP_EDIT_CLIENTSIDE)
    public async editClientSideProp(prop: WorldPlacedProp) {
        if (this.objects[prop.unique_id]) {
            await this.editProp(prop.unique_id, prop);
        }
    }

    private async spawnProp(prop: WorldPlacedProp): Promise<number> {
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

        this.objects[prop.unique_id] = {
            ...prop,
            entity,
        } as SpawedWorlPlacedProp;
        return entity;
    }

    private async despawnProp(uniqueId: string): Promise<boolean> {
        const prop = this.objects[uniqueId];
        delete this.objects[uniqueId];

        if (DoesEntityExist(prop.entity)) {
            DeleteEntity(prop.entity);
            return true;
        }
        return false;
    }

    private async editProp(uniqueId: string, prop: WorldPlacedProp): Promise<boolean> {
        if (!DoesEntityExist(this.objects[uniqueId].entity)) {
            return false;
        }

        const entity = this.objects[uniqueId].entity;

        SetEntityCoordsNoOffset(entity, prop.position[0], prop.position[1], prop.position[2], false, false, false);
        SetEntityHeading(entity, prop.position[3]);

        if (prop.matrix) {
            this.objectService.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityCollision(entity, prop.collision, false);
        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true); // Always freeze for the moment

        this.objects[uniqueId] = {
            ...prop,
            entity,
        } as SpawedWorlPlacedProp;
    }

    public getPropClientData(): PropClientData {
        return {
            total: Object.keys(this.objects).length,
            valid: Object.keys(this.objects).filter(key => DoesEntityExist(this.objects[key].entity)).length,
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
            this.objectService.applyEntityMatrix(entity, prop.matrix);
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
            this.objectService.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true); // Always freeze for the moment
    }

    public async despawnDebugProp(prop: SpawedWorlPlacedProp): Promise<void> {
        if (prop.loaded) {
            if (!this.objects[prop.unique_id]) {
                // The prop should be loaded, but is not for this client. It shouldn't happen
                console.error(`[PropProvider] Prop ${prop.unique_id} is loaded but not spawned. Syncing...`);
                await this.syncPropClientSide();
            }
            console.log(`[PropProvider] Edition prop ${prop.unique_id} in `, this.objects[prop.unique_id]);
            await this.editProp(prop.unique_id, this.objects[prop.unique_id]);
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
                if (!this.objects[prop.unique_id]) {
                    // The prop should be loaded, but is not for this client. It shouldn't happen
                    console.error(`[PropProvider] Prop ${prop.unique_id} is loaded but not spawned. Syncing...`);
                    await this.syncPropClientSide();
                    entity = this.objects[prop.unique_id].entity;
                } else {
                    entity = this.objects[prop.unique_id].entity;
                    if (!DoesEntityExist(entity)) {
                        // The prop should be loaded, exists for the client, but the entity doesn't exist. It shouldn't happen
                        console.error(`[PropProvider] Prop ${prop.unique_id} is loaded but not spawned. Syncing...`);
                        await this.syncPropClientSide();
                        entity = this.objects[prop.unique_id].entity;
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
