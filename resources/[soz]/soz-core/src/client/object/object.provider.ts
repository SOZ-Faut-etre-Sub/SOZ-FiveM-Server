import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Exportable } from '@core/decorators/exports';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Rpc } from '@core/decorators/rpc';
import { emitRpc } from '@core/rpc';
import { ObjectService } from '@public/client/object/object.service';
import { getProperGroundPositionForObject } from '@public/client/object/object.utils';
import { TargetFactory } from '@public/client/target/target.factory';
import { Command } from '@public/core/decorators/command';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { getChunkId, getGridChunks } from '@public/shared/grid';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { RpcClientEvent, RpcServerEvent } from '@public/shared/rpc';

import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { WorldObject } from '../../shared/object';

type SpawnedObject = {
    entity: number;
    object: WorldObject;
};

@Provider()
export class ObjectProvider {
    @Inject(ObjectService)
    private objectService: ObjectService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    private loadedObjects: Record<string, SpawnedObject> = {};

    private objectsByChunk = new Map<number, WorldObject[]>();

    private currentChunks: number[] = [];

    private disabled = false;
    private ready = false;

    public getLoadedObjectsCount(): number {
        return Object.keys(this.loadedObjects).length;
    }

    public getObject(id: string): WorldObject | null {
        const object = this.loadedObjects[id];

        if (object) {
            return object.object;
        }

        return null;
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

        this.targetFactory.createForModel(
            ['prop_cardbordbox_03a', 'prop_roadcone02a'],
            [
                {
                    label: 'Démonter',
                    icon: 'c:jobs/demonter.png',
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
                },
            ],
            2.5
        );

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

        const entity = await this.objectService.createObject(object);

        if (!entity) {
            return;
        }

        this.loadedObjects[object.id] = {
            entity,
            object,
        };

        if (object.targets) {
            this.targetFactory.createForEntity(entity, object.targets);
        }

        await wait(0);
    }

    private unspawnObject(id: string): void {
        const object = this.loadedObjects[id];

        if (!object) {
            return;
        }

        if (object.object.targets) {
            this.targetFactory.removeForEntity(
                [object.entity],
                object.object.targets.map(target => target.label)
            );
        }

        if (!this.objectService.deleteObject(object.entity, object.object)) {
            return;
        }

        delete this.loadedObjects[id];
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
        const propsIds = Object.keys(this.loadedObjects).filter(
            id => isAllowed || (!id.includes('drug_seedling') && !id.includes('gang'))
        );

        console.log(propsIds);
    }

    @OnNuiEvent(NuiEvent.ObjectPlace)
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
}
