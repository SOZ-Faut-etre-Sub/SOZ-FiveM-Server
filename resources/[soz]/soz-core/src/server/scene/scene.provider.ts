import { ScenePedData } from '@public/shared/scene';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { WorldObject } from '../../shared/object';
import { RpcServerEvent } from '../../shared/rpc';
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

    private loadedScenes = new Set<string>();

    @Once(OnceStep.RepositoriesLoaded)
    public async initLoadedScenes() {
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

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
            return;
        }

        this.loadScene(sceneId);
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

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
            return;
        }

        this.unloadScene(sceneId);
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

        const scene = await this.sceneRepository.addScene(name, player.citizenid, eventId);

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
    public async addEntity(source: number, sceneId: string, model: string, object: WorldObject): Promise<void> {
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

        await this.sceneRepository.addEntity(sceneId, model, object);

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

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
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

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
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

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
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

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
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

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
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

        if (!scene.worldEventId) {
            this.notifier.notify(source, `Scene ${scene.name} chargée`);

            await this.startScene(source, sceneId);
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

        if (scene.owner !== player.citizenid && !this.permissionService.isStaff(source)) {
            return;
        }

        await this.sceneRepository.setName(sceneId, name);

        this.notifier.notify(source, `Scene ${oldName} renommée en ${name}`);
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
}
