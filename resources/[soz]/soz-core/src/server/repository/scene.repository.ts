import { Inject, Injectable } from '../../core/decorators/injectable';
import { WorldObject } from '../../shared/object';
import { RepositoryType } from '../../shared/repository';
import { Scene, SceneEntity, SceneMarker, SceneMarkerData, ScenePed, ScenePedData } from '../../shared/scene';
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
                markers: true,
                creator: true,
                associates: true,
            },
        });

        const list: Record<string, Scene> = {};

        for (const scene of scenes) {
            const entities: Record<string, SceneEntity> = {};
            const peds: Record<string, ScenePed> = {};
            const markers: Record<string, SceneMarker> = {};
            const associates = [];
            const charInfo = scene.creator?.charinfo
                ? (JSON.parse(scene.creator?.charinfo) as { firstname: string; lastname: string; dateofbirth: string })
                : null;

            for (const associate of scene.associates) {
                const charInfo = JSON.parse(associate.charinfo) as {
                    firstname: string;
                    lastname: string;
                };

                associates.push({
                    citizenId: associate.citizenid,
                    name: `${charInfo.firstname} ${charInfo.lastname}`,
                });
            }

            for (const entity of scene.entities) {
                entities[entity.id] = {
                    id: entity.id,
                    model: entity.model,
                    userId: entity.user_id,
                    object: {
                        ...(entity.object as WorldObject),
                        id: entity.id,
                    },
                    inventoryId: entity.inventory_id,
                };
            }
            for (const ped of scene.peds) {
                peds[ped.id] = {
                    id: ped.id,
                    ...(ped.ped as ScenePedData),
                };
            }
            for (const marker of scene.markers) {
                markers[marker.id] = {
                    id: marker.id,
                    userId: marker.user_id,
                    ...(marker.marker as SceneMarkerData),
                };
            }

            list[scene.id] = {
                id: scene.id,
                name: scene.name,
                persistent: scene.persistant,
                entities: entities,
                peds: peds,
                markers: markers,
                owner: scene.creator_id,
                ownerName: charInfo ? `${charInfo.firstname} ${charInfo.lastname}` : null,
                worldEventId: scene.event_id,
                createdAt: scene.created_at.getTime(),
                associates,
            };
        }

        return list;
    }

    public async addScene(
        name: string,
        creatorId: string,
        ownerName: string,
        eventId?: string,
        createdAt?: Date
    ): Promise<Scene> {
        const scene = await this.prismaService.scene.create({
            data: {
                name,
                creator_id: creatorId,
                event_id: eventId,
                created_at: createdAt || new Date(),
            },
        });

        this.data[scene.id] = {
            id: scene.id,
            name: scene.name,
            owner: creatorId,
            ownerName,
            persistent: false,
            entities: {},
            peds: {},
            markers: {},
            worldEventId: scene.event_id,
            createdAt: scene.created_at.getTime(),
            associates: [],
        };

        return this.data[scene.id];
    }

    public async addAssociate(sceneId: string, citizenId: string, name: string) {
        await this.prismaService.scene.update({
            where: {
                id: sceneId,
            },
            data: {
                associates: {
                    connect: {
                        citizenid: citizenId,
                    },
                },
            },
        });

        this.data[sceneId].associates.push({
            citizenId,
            name,
        });
    }

    public async removeAssociate(sceneId: string, citizenId: string) {
        await this.prismaService.scene.update({
            where: {
                id: sceneId,
            },
            data: {
                associates: {
                    disconnect: {
                        citizenid: citizenId,
                    },
                },
            },
        });

        this.data[sceneId].associates = this.data[sceneId].associates.filter(
            associate => associate.citizenId !== citizenId
        );
    }

    public async setOwnership(sceneId: string, citizenId: string, name: string) {
        await this.prismaService.scene.update({
            where: {
                id: sceneId,
            },
            data: {
                creator_id: citizenId,
            },
        });

        this.data[sceneId].owner = citizenId;
        this.data[sceneId].ownerName = name;
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
            object: {
                ...object,
                id: entity.id,
            },
        };

        return scene.entities[entity.id];
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
                object: {
                    ...object,
                    id: entityId, // Ensure the ID remains the same
                },
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

    public async setEntityUserId(sceneId: string, entityId: string, userId: string | null) {
        const entity = this.data[sceneId].entities[entityId];
        entity.userId = userId;

        await this.prismaService.scene_entity.update({
            where: {
                id: entityId,
            },
            data: {
                user_id: userId,
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

    public async addMarker(sceneId: string, userId: string, data: SceneMarkerData) {
        const scene = this.data[sceneId];

        const marker = await this.prismaService.scene_marker.create({
            data: {
                scene_id: sceneId,
                user_id: userId,
                marker: data,
            },
        });

        scene.markers[marker.id] = {
            id: marker.id,
            userId,
            ...data,
        };
    }

    public async removeMarker(sceneId: string, markerId: string) {
        const marker = this.data[sceneId].markers[markerId];
        delete this.data[sceneId].markers[markerId];

        await this.prismaService.scene_marker.delete({
            where: {
                id: markerId,
            },
        });

        return marker;
    }

    public async updateMarker(sceneId: string, markerId: string, data: Partial<SceneMarkerData>) {
        const marker = this.data[sceneId].markers[markerId];
        this.data[sceneId].markers[markerId] = {
            ...marker,
            ...data,
        };

        await this.prismaService.scene_marker.update({
            where: {
                id: markerId,
            },
            data: {
                marker: this.data[sceneId].markers[markerId],
            },
        });

        return marker;
    }
}
