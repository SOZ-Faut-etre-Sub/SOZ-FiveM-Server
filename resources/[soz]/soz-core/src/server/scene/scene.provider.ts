import { ScenePedData } from '@public/shared/scene';
import { Vector4 } from 'three';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { joaat } from '../../shared/joaat';
import { WorldObject } from '../../shared/object';
import { RpcServerEvent } from '../../shared/rpc';
import { isPlayerAssociatedToScene, SceneMarkerData } from '../../shared/scene';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { PlayerService } from '../player/player.service';
import { SceneRepository } from '../repository/scene.repository';

@Provider()
export class SceneProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(SceneRepository)
    private sceneRepository: SceneRepository;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    private loadedScenes = new Set<string>();

    public async migrateLegacyScene() {
        const collections = await this.prismaService.collection_prop.findMany();

        for (const collection of collections) {
            let ownerName = null;

            if (collection.creator) {
                const player = await this.prismaService.player.findFirst({
                    where: {
                        citizenid: collection.creator,
                    },
                });

                if (player) {
                    const charInfo = JSON.parse(player.charinfo);
                    ownerName = `${charInfo.firstname} ${charInfo.lastname}`;
                }
            }

            const date = new Date(collection.date);
            const scene = await this.sceneRepository.addScene(
                collection.name,
                collection.creator,
                ownerName,
                null,
                date
            );

            if (collection.persistant) {
                await this.sceneRepository.setPersistent(scene.id, true);
            }

            // load objects of scene
            const objects = await this.prismaService.placed_prop.findMany({
                where: {
                    collection: scene.name,
                },
            });

            for (const object of objects) {
                const position = JSON.parse(object.position) as Vector4;
                const rotationZ = position[4] <= 180 ? position[4] : position[4] - 360;

                await this.sceneRepository.addEntity(scene.id, object.model, {
                    id: object.unique_id,
                    model: joaat(object.model),
                    position: JSON.parse(object.position),
                    matrix: JSON.parse(object.matrix),
                    rotation: [0, 0, rotationZ],
                    placeOnGround: false,
                    effect: null,
                    vfx: null,
                    noCollision: !object.collision,
                });
            }

            await this.prismaService.placed_prop.deleteMany({
                where: {
                    collection: scene.name,
                },
            });

            await this.prismaService.collection_prop.delete({
                where: {
                    id: collection.id,
                },
            });
        }
    }

    @Once(OnceStep.RepositoriesLoaded)
    public async initLoadedScenes() {
        await this.migrateLegacyScene();
        await this.sceneRepository.refresh();

        const scenes = await this.sceneRepository.get();

        for (const scene of Object.values(scenes)) {
            if (scene.persistent && !scene.worldEventId) {
                this.loadedScenes.add(scene.id);
            }
        }
    }

    @Rpc(RpcServerEvent.SCENE_GET_LOADED)
    public async getLoadedScenes(): Promise<string[]> {
        return Array.from(this.loadedScenes);
    }

    @OnEvent(ServerEvent.SCENE_LOAD)
    public async startScene(source: number, sceneId: string) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        this.loadScene(sceneId);

        this.notifier.notify(source, `Scene ${scene.name} chargée`);
    }

    @OnEvent(ServerEvent.SCENE_UNLOAD)
    public async stopScene(source: number, sceneId: string) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        this.unloadScene(sceneId);

        this.notifier.notify(source, `Scene ${scene.name} déchargée`);
    }

    @OnEvent(ServerEvent.SCENE_CREATE)
    public async createScene(source: number, name: string, eventId?: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (eventId && !this.permissionService.isStaff(source)) {
            return;
        }

        const ownerName = `${player.charinfo.firstname} ${player.charinfo.lastname}`;
        const scene = await this.sceneRepository.addScene(name, player.citizenid, ownerName, eventId);

        this.notifier.notify(source, `Scene ${scene.name} crée`);
    }

    @OnEvent(ServerEvent.SCENE_DELETE)
    public async removeScene(source: number, sceneId: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.removeScene(sceneId);

        this.notifier.notify(source, `Scene ${scene.name} supprimée`);
    }

    @OnEvent(ServerEvent.SCENE_ADD_ENTITY)
    public async addEntity(
        source: number,
        sceneId: string,
        model: string,
        object: WorldObject,
        userId?: string
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        const entity = await this.sceneRepository.addEntity(sceneId, model, object);

        if (userId) {
            await this.sceneRepository.setEntityUserId(sceneId, entity.id, userId);
        }

        this.notifier.notify(source, `Entity ${model} ajoutée à la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_REMOVE_ENTITY)
    public async removeEntity(source: number, sceneId: string, entityId: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        const entity = await this.sceneRepository.removeEntity(sceneId, entityId);

        this.notifier.notify(source, `Entity ${entity.model} supprimée de la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_UPDATE_ENTITY)
    public async updateEntity(
        source: number,
        sceneId: string,
        entityId: string,
        object: Partial<WorldObject>
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.updateEntity(sceneId, entityId, object);

        this.notifier.notify(source, `Entité mise à jour dans la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_ADD_PED)
    public async addPed(source: number, sceneId: string, ped: ScenePedData): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.addPed(sceneId, ped);

        this.notifier.notify(source, `Ped ${ped.model} ajoutée à la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_REMOVE_PED)
    public async removePed(source: number, sceneId: string, pedId: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        const ped = await this.sceneRepository.removePed(sceneId, pedId);

        this.notifier.notify(source, `Ped ${ped.model} supprimée de la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_UPDATE_PED)
    public async updatePed(source: number, sceneId: string, pedId: string, data: Partial<ScenePedData>): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.updatePed(sceneId, pedId, data);

        this.notifier.notify(source, `Ped mis à jour dans la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_SET_PERSISTENT)
    public async setPersistent(source: number, sceneId: string, persistent: boolean): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.setPersistent(sceneId, persistent);

        if (persistent) {
            this.notifier.notify(source, `Scene ${scene.name} persistée`);
        } else {
            this.notifier.notify(source, `Scene ${scene.name} non persistée`);
        }
    }

    @OnEvent(ServerEvent.SCENE_SET_ENTITY_INVENTORY)
    public async setEntityInventory(
        source: number,
        sceneId: string,
        entityId: string,
        inventoryId: string
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!this.permissionService.isStaff(source)) {
            return;
        }

        const entity = await this.sceneRepository.setEntityInventory(sceneId, entityId, inventoryId);

        this.notifier.notify(source, `Inventaire de l'entité ${entity.model} mis à jour dans la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_SET_NAME)
    public async setName(source: number, sceneId: string, name: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);
        const oldName = scene.name;

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.setName(sceneId, name);

        this.notifier.notify(source, `Scene ${oldName} renommée en ${name}`);
    }

    @OnEvent(ServerEvent.SCENE_ADD_MARKER)
    public async addMarker(
        source: number,
        sceneId: string,
        userId: string,
        markerData: SceneMarkerData
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.addMarker(sceneId, userId, markerData);

        this.notifier.notify(source, `Marker ${userId} ajouté à la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_REMOVE_MARKER)
    public async removeMarker(source: number, sceneId: string, markerId: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        const marker = await this.sceneRepository.removeMarker(sceneId, markerId);

        this.notifier.notify(source, `Marker ${marker.userId} supprimé de la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_UPDATE_MARKER)
    public async updateMarker(
        source: number,
        sceneId: string,
        markerId: string,
        markerData: SceneMarkerData
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.updateMarker(sceneId, markerId, markerData);

        this.notifier.notify(source, `Marker mis à jour dans la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_ENTITY_SET_USER_ID)
    public async setEntityUserId(source: number, sceneId: string, entityId: string, userId: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (!isPlayerAssociatedToScene(player.citizenid, scene) && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.setEntityUserId(sceneId, entityId, userId);

        this.notifier.notify(source, `Entité défini avec ${userId} dans la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_ADD_ASSOCIATE)
    public async addAssociate(source: number, sceneId: string, associatePhoneNumber: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
            return;
        }

        const associate = await this.prismaService.player.findFirst({
            where: {
                charinfo: {
                    contains: associatePhoneNumber,
                },
            },
        });

        if (!associate) {
            this.notifier.notify(source, `Aucun joueur trouvé avec le numéro de téléphone ${associatePhoneNumber}`);

            return;
        }

        const associateCharInfo = JSON.parse(associate.charinfo);
        const name = `${associateCharInfo.firstname} ${associateCharInfo.lastname}`;

        await this.sceneRepository.addAssociate(sceneId, associate.citizenid, name);

        this.notifier.notify(source, `Associé ${name} ajouté à la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_REMOVE_ASSOCIATE)
    public async removeAssociate(source: number, sceneId: string, associateId: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.removeAssociate(sceneId, associateId);

        this.notifier.notify(source, `Associé supprimé de la scene ${scene.name}`);
    }

    @OnEvent(ServerEvent.SCENE_TRANSFER_OWNER)
    public async transferOwner(source: number, sceneId: string, citizenId: string): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const scene = await this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
            return;
        }

        const newOwner = await this.prismaService.player.findFirst({
            where: {
                citizenid: citizenId,
            },
        });

        if (!newOwner) {
            return;
        }

        const newOwnerCharInfo = JSON.parse(newOwner.charinfo);
        const name = `${newOwnerCharInfo.firstname} ${newOwnerCharInfo.lastname}`;

        const previousOwnerId = scene.owner;
        const previousOwnerName = scene.ownerName;

        await this.sceneRepository.removeAssociate(sceneId, citizenId);
        await this.sceneRepository.addAssociate(sceneId, previousOwnerId, previousOwnerName);
        await this.sceneRepository.setOwnership(sceneId, citizenId, name);

        this.notifier.notify(source, `Scène ${scene.name} transférée à ${name}`);
    }

    public loadScene(sceneId: string) {
        if (this.loadedScenes.has(sceneId)) {
            return;
        }

        this.loadedScenes.add(sceneId);
        TriggerClientEvent(ClientEvent.SCENE_LOAD, -1, sceneId);
    }

    public unloadScene(sceneId: string) {
        this.loadedScenes.delete(sceneId);
        TriggerClientEvent(ClientEvent.SCENE_UNLOAD, -1, sceneId);
    }

    @OnEvent(ServerEvent.PROP_DUMP_COLLECTION)
    public ondump(source: number, name: string, data) {
        name = name.replaceAll(' ', '_').replaceAll('é', 'e').replaceAll('ë', 'e').toLowerCase();
        let str = `<?xml version="1.0" encoding="UTF-8"?>
<CMapData>
 <name>${name}</name>
 <parent></parent>
 <streamingExtentsMin x="0" y="0" z="0" />
 <streamingExtentsMax x="0" y="0" z="0" />
 <entitiesExtentsMin x="0" y="0" z="0" />
 <entitiesExtentsMax x="0" y="0" z="0" />
 <entities>`;

        for (const datum of data) {
            let flag = 33;
            if (datum.noCollision) {
                flag += 4;
            }
            str += `<Item type="CEntityDef">
   <archetypeName>${datum.model}</archetypeName>
   <flags value="${flag}" />
   <guid value="0" />
   <position x="${datum.coords[0]}" y="${datum.coords[1]}" z="${datum.coords[2]}" />
   <rotation x="${datum.quaternion[0]}" y="${datum.quaternion[1]}" z="${datum.quaternion[2]}" w="${-datum.quaternion[3]}" />
   <scaleXY value="${datum.scaleX}" />
   <scaleZ value="${datum.scaleZ}" />
   <parentIndex value="-1" />
   <lodDist value="200" />
   <childLodDist value="0" />
   <lodLevel>LODTYPES_DEPTH_ORPHANHD</lodLevel>
   <numChildren value="0" />
   <priorityLevel>PRI_REQUIRED</priorityLevel>
   <extensions />
   <ambientOcclusionMultiplier value="255" />
   <artificialAmbientOcclusion value="255" />
   <tintValue value="0" />
</Item>
`;
        }

        str += ` </entities>
    <containerLods itemType="rage__fwContainerLodDef" />
    <boxOccluders itemType="BoxOccluder" />
    <occludeModels itemType="OccludeModel" />
    <physicsDictionaries />
    <instancedData>
        <ImapLink />
        <PropInstanceList itemType="rage__fwPropInstanceListDef" />
        <GrassInstanceList itemType="rage__fwGrassInstanceListDef" />
    </instancedData>
    <timeCycleModifiers itemType="CTimeCycleModifier">
    </timeCycleModifiers>
    <carGenerators itemType="CCarGen" />
    <LODLightsSOA>
        <direction itemType="FloatXYZ" />
        <falloff />
        <falloffExponent />
        <timeAndStateFlags />
        <hash />
        <coneInnerAngle />
        <coneOuterAngleOrCapExt />
        <coronaIntensity />
    </LODLightsSOA>
    <DistantLODLightsSOA>
        <position itemType="FloatXYZ" />
        <RGBI />
        <numStreetLights value="0" />
        <category value="0" />
    </DistantLODLightsSOA>
    <block>
        <version value="0" />
        <flags value="0" />
        <name>hei_dt1_02</name>
        <exportedBy>laikker</exportedBy>
        <owner></owner>
        <time>02 December 2024 10:48</time>
    </block>
 </CMapData>
 `;

        SaveResourceFile('soz-core', name + '.ymap.xml', str, -1);
        this.notifier.notify(source, 'Dump ' + name);
    }
}
