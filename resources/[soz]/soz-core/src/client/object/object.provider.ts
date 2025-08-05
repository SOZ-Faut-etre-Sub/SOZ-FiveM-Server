import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Exportable } from '@core/decorators/exports';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Rpc } from '@core/decorators/rpc';
import { emitRpc, emitRpcTimeout } from '@core/rpc';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ObjectService } from '@public/client/object/object.service';
import { getProperGroundPositionForObject } from '@public/client/object/object.utils';
import { InteractionProvider } from '@public/client/quick-interaction/interaction.provider';
import { TargetFactory } from '@public/client/target/target.factory';
import { Command } from '@public/core/decorators/command';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { getChunkId, getGridChunks } from '@public/shared/grid';
import { InventoryType } from '@public/shared/inventory';
import { joaat } from '@public/shared/joaat';
import { LOW_RANGE_JOBS_ITEMS } from '@public/shared/job';
import { ModelSwap } from '@public/shared/modelswap';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { RpcClientEvent, RpcServerEvent } from '@public/shared/rpc';
import { TargetOption } from '@public/shared/target';

import { ClientEvent, ServerEvent } from '../../shared/event';
import { WorldObject } from '../../shared/object';
import { DnDCallback, InventoryDragAndDropProvider } from '../inventory/inventory.draganddrop.provider';

const RemovableObjects = [GetHashKey('prop_cardbordbox_03a'), GetHashKey('prop_roadcone02a')];

type SpawnedObject = {
    entity: number;
    object: WorldObject;
    targets: TargetOption[];
    dragAndDropCallbacks: DnDCallback[];
};

type SpawnableObject = {
    object: WorldObject;
    targets: TargetOption[];
    dragAndDropCallbacks: DnDCallback[];
};

@Provider()
export class ObjectProvider {
    @Inject(ObjectService)
    private objectService: ObjectService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryDragAndDropProvider)
    private inventoryDragAndDropProvider: InventoryDragAndDropProvider;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(InteractionProvider)
    private interactionProvider: InteractionProvider;

    private loadedObjects: Record<string, SpawnedObject> = {};

    private objectsByChunk = new Map<number, Map<string, SpawnableObject>>();

    private objectsById = new Map<string, SpawnableObject>();

    private currentChunks: number[] = [];

    private disabled = false;
    private ready = false;

    public getLoadedObjectsCount(): number {
        return Object.keys(this.loadedObjects).length;
    }

    public hasObject(id: string): boolean {
        return this.findObject(id) !== null;
    }

    public getObject(id: string): WorldObject | null {
        const object = this.loadedObjects[id];

        if (object) {
            return object.object;
        }

        return null;
    }

    public findObject(id: string): WorldObject | null {
        if (this.objectsById.has(id)) {
            return this.objectsById.get(id).object;
        }

        return null;
    }

    public getObjects(filter?: (object: WorldObject) => boolean): WorldObject[] {
        const objects: WorldObject[] = [];

        for (const chunk of this.objectsByChunk.values()) {
            for (const object of chunk.values()) {
                if (!filter || filter(object.object)) {
                    objects.push(object.object);
                }
            }
        }

        return objects;
    }

    public getLoadedObjects(filter?: (object: WorldObject) => boolean): WorldObject[] {
        const objects: WorldObject[] = [];

        for (const object of Object.values(this.loadedObjects)) {
            if (!filter || filter(object.object)) {
                objects.push(object.object);
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

    public async setupObjects(): Promise<void> {
        const objects = await emitRpcTimeout<WorldObject[]>(RpcServerEvent.OBJECT_GET_LIST, 10_000);

        for (const object of objects) {
            await this.createObject(object);
        }

        const lowJobsItem = {};
        for (const [modelString, value] of Object.entries(LOW_RANGE_JOBS_ITEMS)) {
            lowJobsItem[GetHashKey(modelString)] = value;
        }

        RemovableObjects.forEach(model => {
            const config = lowJobsItem[model] || {
                interactionDistance: 1.5,
                drawDistance: 6.0,
            };

            this.interactionProvider.createInteractionForModels(
                model,
                {
                    label: 'Démonter',
                    canInteract: entity => {
                        const id = this.getIdFromEntity(entity);
                        return id !== null;
                    },
                    action: async (entity: number) => {
                        const id = this.getIdFromEntity(entity);
                        if (!id) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.OBJECT_COLLECT, id);
                    },
                    job: config.jobs,
                },
                undefined,
                config.interactionDistance,
                config.drawDistance
            );
        });

        this.ready = true;
    }

    public isReady() {
        return this.ready;
    }

    @OnEvent(ClientEvent.OBJECT_CREATE)
    public async createObjects(
        objects: WorldObject[],
        targets: TargetOption[] = [],
        dragAndDropCallbacks: DnDCallback[] = []
    ) {
        for (const object of objects) {
            await this.createObject(object, targets, dragAndDropCallbacks);
        }
    }

    @Exportable('CreateObject')
    public async createObject(
        object: WorldObject,
        targets: TargetOption[] = [],
        dragAndDropCallbacks: DnDCallback[] = []
    ): Promise<string> {
        const spawnableObject = {
            object,
            targets,
            dragAndDropCallbacks,
        };

        if (object.permanent) {
            await this.spawnObject(spawnableObject);

            return object.id;
        }

        const chunk = getChunkId(object.position);

        if (!this.objectsByChunk.has(chunk)) {
            this.objectsByChunk.set(chunk, new Map());
        }

        this.objectsByChunk.get(chunk).set(spawnableObject.object.id, spawnableObject);
        this.objectsById.set(object.id, spawnableObject);

        if (this.currentChunks.includes(chunk)) {
            await this.spawnObject(spawnableObject);
        }

        return object.id;
    }

    @OnEvent(ClientEvent.OBJECT_EDIT)
    public async editObject(object: WorldObject) {
        this.deleteObject(object.id);

        await wait(0);
        await this.createObject(object);
    }

    @Exportable('GetObjectIdFromEntity')
    public getIdFromEntity(entity: number): string | null {
        for (const spawnedObject of Object.values(this.loadedObjects)) {
            if (spawnedObject.entity === entity) {
                return spawnedObject.object.id;
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
        const obj = this.objectsById.get(id);
        if (obj) {
            const chunk = getChunkId(obj.object.position);
            const perChunk = this.objectsByChunk.get(chunk);
            if (perChunk) {
                perChunk.delete(id);

                if (perChunk?.size === 0) {
                    this.objectsByChunk.delete(chunk);
                }
            }
        }

        this.objectsById.delete(id);
        this.unspawnObject(id);
    }

    public async updateObject(
        object: WorldObject,
        targets: TargetOption[] = [],
        dragAndDropCallbacks: DnDCallback[] = []
    ) {
        // if the object is not loaded, delete it and create it again
        if (!this.loadedObjects[object.id]) {
            this.deleteObject(object.id);
            await this.createObject(object, targets, dragAndDropCallbacks);

            return;
        }

        // object is loaded, check if same grid chunk
        const existingObject = this.loadedObjects[object.id];
        const existingChunk = getChunkId(existingObject.object.position);
        const newChunk = getChunkId(object.position);

        // if the chunk is not the same, delete the object and create it again
        if (existingChunk !== newChunk) {
            this.deleteObject(object.id);
            await this.createObject(object, targets, dragAndDropCallbacks);

            return;
        }

        // if the chunk is the same, update the object
        const objectInChunk = this.objectsByChunk.get(newChunk)?.get(object.id);

        if (objectInChunk) {
            objectInChunk.object = object;
            objectInChunk.targets = targets;
            objectInChunk.dragAndDropCallbacks = dragAndDropCallbacks;
        }

        if (existingObject.dragAndDropCallbacks) {
            this.inventoryDragAndDropProvider.unregisterEntity(existingObject.entity);
        }

        existingObject.object = object;
        existingObject.targets = targets;
        existingObject.dragAndDropCallbacks = dragAndDropCallbacks;

        if (existingObject.dragAndDropCallbacks) {
            this.inventoryDragAndDropProvider.registerEntity(existingObject.entity, dragAndDropCallbacks);
        }

        await this.objectService.updateObject(existingObject.entity, object);

        targets = [...existingObject.targets];

        if (object.inventoryId) {
            targets.push({
                label: 'Ouvrir',
                icon: 'inventory/ouvrir_le_stockage',
                category: 'citizen',
                canInteract: () => true,
                action: () => {
                    this.inventoryManager.openInventory(
                        InventoryType.ObjectStorage,
                        object.inventoryId,
                        object.position
                    );
                },
            });
        }

        if (existingObject.targets) {
            this.targetFactory.createForEntity(existingObject.entity, targets, 2.5, object.id);
        } else {
            this.targetFactory.removeForEntity([existingObject.entity]);
        }
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
                for (const [, spawnableObject] of this.objectsByChunk.get(chunk)) {
                    this.unspawnObject(spawnableObject.object.id);
                }
            }
        }

        // Load objects from added chunks
        for (const chunk of addedChunks) {
            if (this.objectsByChunk.has(chunk)) {
                for (const [, spawnableObject] of this.objectsByChunk.get(chunk)) {
                    await this.spawnObject(spawnableObject);
                }
            }
        }
    }

    private async spawnObject(spawnableObject: SpawnableObject) {
        if (this.loadedObjects[spawnableObject.object.id]) {
            return;
        }

        const entity = await this.objectService.createObject(spawnableObject.object);

        if (!entity) {
            return;
        }

        this.loadedObjects[spawnableObject.object.id] = {
            entity,
            object: spawnableObject.object,
            targets: spawnableObject.targets,
            dragAndDropCallbacks: spawnableObject.dragAndDropCallbacks,
        };

        const targets = [...spawnableObject.targets];

        if (spawnableObject.object.inventoryId) {
            targets.push({
                label: 'Ouvrir',
                icon: 'inventory/ouvrir_le_stockage',
                category: 'citizen',
                canInteract: () => true,
                action: () => {
                    this.inventoryManager.openInventory(
                        InventoryType.ObjectStorage,
                        spawnableObject.object.inventoryId,
                        spawnableObject.object.position
                    );
                },
            });
        }

        if (targets.length > 0) {
            this.targetFactory.createForEntity(entity, targets, 2.5, spawnableObject.object.id);
        }

        if (spawnableObject.dragAndDropCallbacks) {
            this.inventoryDragAndDropProvider.registerEntity(entity, spawnableObject.dragAndDropCallbacks);
        }

        TriggerEvent(ClientEvent.OBJECT_SPAWN, spawnableObject.object.id, entity);

        await wait(0);
    }

    private unspawnObject(id: string): void {
        const spawnedObject = this.loadedObjects[id];

        if (!spawnedObject) {
            return;
        }

        if (spawnedObject.targets) {
            this.targetFactory.removeForEntity([spawnedObject.entity]);
        }

        if (spawnedObject.dragAndDropCallbacks) {
            this.inventoryDragAndDropProvider.unregisterEntity(spawnedObject.entity);
        }

        if (!this.objectService.deleteObject(spawnedObject.entity, spawnedObject.object)) {
            return;
        }

        if (spawnedObject.targets) {
            this.targetFactory.removeForEntity([spawnedObject.entity]);
        }

        if (spawnedObject.object.inventoryId) {
            this.targetFactory.removeForEntity([spawnedObject.entity]);
        }

        delete this.loadedObjects[id];

        TriggerEvent(ClientEvent.OBJECT_DESPAWN, spawnedObject.object.id, spawnedObject.entity);
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

    @Rpc(RpcClientEvent.OBJECT_GET_GROUND_POSITION)
    public getGroundPosition(props: string, offset = 0.0, rotation = 0): Vector4 {
        const ped = PlayerPedId();
        const position = GetOffsetFromEntityInWorldCoords(ped, 0.0, 1.0, 0.0) as Vector3;
        const heading = GetEntityHeading(ped) + rotation;
        const groundPosition = getProperGroundPositionForObject(GetHashKey(props), position, heading);

        return [groundPosition[0], groundPosition[1], groundPosition[2] + offset, heading];
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

    @Tick(TickInterval.EVERY_MINUTE, 'object-scale')
    public async objectScale() {
        for (const obj of Object.values(this.loadedObjects)) {
            if (obj.object.growth) {
                this.objectService.computeGrowth(obj.entity, obj.object);
            }
        }
    }

    @Tick(30000, 'object-spawn-check')
    public async objectSpawnCheck() {
        for (const spawnedObject of Object.values(this.loadedObjects)) {
            if (!DoesEntityExist(spawnedObject.entity)) {
                console.log('object-spawn-check: missing entity, trying to fix it', spawnedObject.object.id);
                delete this.loadedObjects[spawnedObject.object.id];

                this.spawnObject({
                    object: spawnedObject.object,
                    targets: spawnedObject.targets,
                    dragAndDropCallbacks: spawnedObject.dragAndDropCallbacks,
                });
            }
        }
    }

    @Command('props')
    public async listprops() {
        const [isAllowed] = await emitRpc<[boolean, string]>(RpcServerEvent.ADMIN_IS_ALLOWED);
        const propsIds = Object.keys(this.loadedObjects).filter(
            id => isAllowed || (!id.includes('drug_seedling') && !id.includes('gang'))
        );

        console.log(propsIds);
    }

    @OnEvent(ClientEvent.OBJECT_PLACE_JOB)
    public async onPlaceObject({
        item,
        props,
        rotation,
        offset,
    }: {
        item: string;
        props: string;
        rotation?: number;
        offset?: number;
    }) {
        const groundPosition = this.getGroundPosition(props, offset || 0.0, rotation || 0);

        TriggerServerEvent(ServerEvent.OBJECT_PLACE, item, props, groundPosition);
    }

    public async createSwap(swap: ModelSwap) {
        const model = joaat(swap.source);
        const target = joaat(swap.target);
        for (const spawnableObject of Object.values(this.loadedObjects)) {
            if (spawnableObject.entity && spawnableObject.object.model !== model) {
                continue;
            }

            if (getDistance(swap.position, spawnableObject.object.position) > swap.range) {
                continue;
            }

            if (![model, target].includes(GetEntityModel(spawnableObject.entity))) {
                continue;
            }

            this.unspawnObject(spawnableObject.object.id);
            await this.spawnObject(spawnableObject);
        }
    }

    public async removeSwap(swap: ModelSwap) {
        const model = joaat(swap.source);
        for (const chunk of this.currentChunks) {
            if (this.objectsByChunk.has(chunk)) {
                for (const [, spawnableObject] of this.objectsByChunk.get(chunk)) {
                    if (spawnableObject.object.model !== model) {
                        continue;
                    }

                    if (getDistance(swap.position, spawnableObject.object.position) > swap.range) {
                        continue;
                    }

                    this.unspawnObject(spawnableObject.object.id);
                    await this.spawnObject(spawnableObject);
                }
            }
        }
    }
}
