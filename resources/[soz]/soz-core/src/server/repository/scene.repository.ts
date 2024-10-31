import { Inject, Injectable } from '../../core/decorators/injectable';
import { WorldObject } from '../../shared/object';
import { RepositoryType } from '../../shared/repository';
import { Scene, SceneEntity, ScenePed, ScenePedData } from '../../shared/scene';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(SceneRepository, Repository)
export class SceneRepository extends Repository<RepositoryType.Scene> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.Scene;

    protected async load(): Promise<Record<string, Scene>> {
        const scenes = await this.prismaService.scene.findMany({
            include: {
                entities: true,
                peds: true,
            },
        });

        const list: Record<string, Scene> = {};

        for (const scene of scenes) {
            const entities: Record<string, SceneEntity> = {};
            const peds: Record<string, ScenePed> = {};

            for (const entity of scene.entities) {
                entities[entity.id] = {
                    id: entity.id,
                    model: entity.model,
                    object: entity.object as WorldObject,
                    inventoryId: entity.inventory_id,
                };
            }
            for (const ped of scene.peds) {
                peds[ped.id] = {
                    id: ped.id,
                    ...(ped.ped as ScenePedData),
                };
            }

            list[scene.id] = {
                id: scene.id,
                name: scene.name,
                persistent: scene.persistant,
                entities: entities,
                peds: peds,
                owner: scene.creator_id,
                worldEventId: scene.event_id,
            };
        }

        return list;
    }

    public async addScene(name: string, creatorId: string, eventId?: string) {
        const scene = await this.prismaService.scene.create({
            data: {
                name,
                creator_id: creatorId,
                event_id: eventId,
            },
        });

        this.data[scene.id] = {
            id: scene.id,
            name: scene.name,
            persistent: false,
            entities: {},
            peds: {},
            worldEventId: scene.event_id,
        };

        return this.data[scene.id];
    }

    public async setPersistent(sceneId: string, persistent: boolean) {
        const scene = this.data[sceneId];

        scene.persistent = persistent;

        await this.prismaService.scene.update({
            where: {
                id: sceneId,
            },
            data: {
                persistant: persistent,
            },
        });

        return scene;
    }

    public async setName(sceneId: string, name: string) {
        const scene = this.data[sceneId];
        scene.name = name;

        await this.prismaService.scene.update({
            where: {
                id: sceneId,
            },
            data: {
                name,
            },
        });

        return scene;
    }

    public async removeScene(sceneId: string) {
        const scene = this.data[sceneId];

        delete this.data[sceneId];

        await this.prismaService.scene.delete({
            where: {
                id: sceneId,
            },
        });

        return scene;
    }

    public async addEntity(sceneId: string, model: string, object: WorldObject) {
        const scene = this.data[sceneId];

        const entity = await this.prismaService.scene_entity.create({
            data: {
                scene_id: sceneId,
                model,
                object,
            },
        });

        scene.entities[entity.id] = {
            id: entity.id,
            model: entity.model,
            object,
        };
    }

    public async removeEntity(sceneId: string, entityId: string) {
        const entity = this.data[sceneId].entities[entityId];
        delete this.data[sceneId].entities[entityId];

        await this.prismaService.scene_entity.delete({
            where: {
                id: entityId,
            },
        });

        return entity;
    }

    public async updateEntity(sceneId: string, entityId: string, object: Partial<WorldObject>) {
        const entity = this.data[sceneId].entities[entityId];

        entity.object = { ...entity.object, ...object };

        await this.prismaService.scene_entity.update({
            where: {
                id: entityId,
            },
            data: {
                object,
            },
        });

        return entity;
    }

    public async setEntityInventory(sceneId: string, entityId: string, inventoryId: string | null) {
        const entity = this.data[sceneId].entities[entityId];
        entity.inventoryId = inventoryId;

        await this.prismaService.scene_entity.update({
            where: {
                id: entityId,
            },
            data: {
                inventory_id: inventoryId,
            },
        });

        return entity;
    }

    public async addPed(sceneId: string, data: ScenePedData) {
        const scene = this.data[sceneId];

        const ped = await this.prismaService.scene_ped.create({
            data: {
                scene_id: sceneId,
                ped: data,
            },
        });

        scene.peds[ped.id] = {
            id: ped.id,
            ...data,
        };
    }

    public async removePed(sceneId: string, pedId: string) {
        const entity = this.data[sceneId].peds[pedId];
        delete this.data[sceneId].peds[pedId];

        await this.prismaService.scene_ped.delete({
            where: {
                id: pedId,
            },
        });

        return entity;
    }

    public async updatePed(sceneId: string, pedId: string, data: Partial<ScenePedData>) {
        const ped = this.data[sceneId].peds[pedId];
        this.data[sceneId].peds[pedId] = {
            ...ped,
            ...data,
        };

        await this.prismaService.scene_ped.update({
            where: {
                id: pedId,
            },
            data: {
                ped: this.data[sceneId].peds[pedId],
            },
        });

        return ped;
    }
}
