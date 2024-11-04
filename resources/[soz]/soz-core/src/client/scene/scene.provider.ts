import { toVector4Object } from '@public/shared/polyzone/vector';
import { WeaponName } from '@public/shared/weapons/weapon';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { RepositoryDelete, RepositoryUpdate } from '../../core/decorators/repository';
import { emitRpc } from '../../core/rpc';
import { uuidv4 } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { FDO, JobType } from '../../shared/job';
import { NotEmptyStringValidator } from '../../shared/nui/input';
import { MenuType } from '../../shared/nui/menu';
import { ObjectEditorContext } from '../../shared/object';
import { RepositoryType } from '../../shared/repository';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { Scene, ScenePedBehavior, ScenePedData } from '../../shared/scene';
import { TargetOption } from '../../shared/target';
import { PedFactory } from '../factory/ped.factory';
import { InventoryManager } from '../inventory/inventory.manager';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { ObjectEditorProvider } from '../object/object.editor.provider';
import { ObjectProvider } from '../object/object.provider';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { ProgressService } from '../progress.service';
import { ResourceLoader } from '../repository/resource.loader';
import { SceneRepository } from '../repository/scene.repository';
import { WorldEventProvider } from '../world/world.event.provider';

type CurrentSceneEdited = {
    scene: Scene;
    context: ObjectEditorContext;
};

@Provider()
export class SceneProvider {
    @Inject(SceneRepository)
    private sceneRepository: SceneRepository;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(ObjectEditorProvider)
    private objectEditorProvider: ObjectEditorProvider;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(WorldEventProvider)
    private worldEventProvider: WorldEventProvider;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private highlightedObjectId: string = null;

    private loadedScenes = new Set<string>();

    private currentSceneEdited: CurrentSceneEdited = null;

    @Once(OnceStep.RepositoriesLoaded)
    public async initLoadScenes() {
        const loadedScenes = await emitRpc<string[]>(RpcServerEvent.SCENE_GET_LOADED);

        for (const sceneId of loadedScenes) {
            await this.loadScene(sceneId);
        }
    }

    @OnNuiEvent(NuiEvent.SceneStartEditing)
    async startEditScene({ sceneId, context }: { sceneId: string; context: ObjectEditorContext }) {
        await this.stopEditScene();

        const menuType = this.nuiMenu.getOpened();

        if (menuType === null) {
            return;
        }

        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (this.loadedScenes.has(scene.id)) {
            // Unload scene if necessary to add highlight
            await this.doUnloadScene(scene);
        }

        this.currentSceneEdited = {
            scene,
            context,
        };
        this.highlightedObjectId = null;

        await this.doLoadScene(scene, true);
        await this.applyHighlight(scene);
    }

    @OnNuiEvent(NuiEvent.SceneStopEditing)
    async stopEditScene() {
        if (this.currentSceneEdited === null) {
            return;
        }

        if (this.nuiMenu.getOpened() === MenuType.ObjectEditor) {
            return;
        }

        await this.doUnloadScene(this.currentSceneEdited.scene);

        if (this.loadedScenes.has(this.currentSceneEdited.scene.id)) {
            // reload scene if necessary without highlight
            await this.doLoadScene(this.currentSceneEdited.scene);
            await this.applyHighlight(this.currentSceneEdited.scene);
        }

        this.currentSceneEdited = null;
    }

    @OnNuiEvent(NuiEvent.SceneSetEntityHighlighted)
    async setEntityHighlighted({ objectId }: { objectId?: string }) {
        if (!this.currentSceneEdited) {
            return;
        }

        this.highlightedObjectId = objectId || null;
        await this.applyHighlight(this.currentSceneEdited.scene);
    }

    private async applyHighlight(scene: Scene) {
        for (const sceneEntity of Object.values(scene.entities)) {
            const entity = this.objectProvider.getEntityFromId(sceneEntity.object.id);

            if (!entity) {
                continue;
            }

            if (
                this.currentSceneEdited?.scene?.id === scene.id &&
                (this.highlightedObjectId === null || sceneEntity.id === this.highlightedObjectId)
            ) {
                SetEntityDrawOutlineColor(0, 180, 0, 255);
                SetEntityDrawOutlineShader(1);
                SetEntityDrawOutline(entity, true);
            } else {
                SetEntityDrawOutline(entity, false);
            }
        }
        for (const scenePed of Object.values(scene.peds)) {
            const ped = this.pedFactory.findLoadedPed(scenePed.id);

            if (!ped) {
                continue;
            }

            if (this.currentSceneEdited?.scene?.id === scene.id && scenePed.id === this.highlightedObjectId) {
                await this.resourceLoader.loadAnimationDictionary('missminuteman_1ig_2');
                TaskPlayAnim(
                    ped.entity,
                    'missminuteman_1ig_2',
                    'handsup_base',
                    8.0,
                    8.0,
                    -1,
                    1,
                    0,
                    false,
                    false,
                    false
                );
            } else {
                ClearPedTasksImmediately(ped.entity);
            }
        }
    }

    @OnNuiEvent(NuiEvent.SceneCreate)
    async onNuiCreateScene({ eventId }: { eventId?: string }) {
        const name = await this.inputService.askInput(
            {
                title: 'Nom de la scène',
                defaultValue: '',
                maxCharacters: 50,
            },
            NotEmptyStringValidator
        );

        if (!name) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_CREATE, name, eventId);
    }

    @OnNuiEvent(NuiEvent.SceneDelete)
    async onNuiDeleteScene({ sceneId }: { sceneId: string }) {
        const confirm = await this.inputService.askConfirm('Veuillez confimer la suppression de la scène (OUI)');
        if (!confirm) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_DELETE, sceneId);
    }

    @OnNuiEvent(NuiEvent.SceneSearchEntity)
    async onNuiSearchSceneEntity() {
        this.nuiDispatch.dispatch('scene', 'ShowSearch', 'https://gtahash.ru/');
    }

    @OnNuiEvent(NuiEvent.SceneAddEntity)
    async onNuiAddSceneEntity({ sceneId }: { sceneId: string }) {
        const model = await this.inputService.askInput<string>(
            {
                title: "Modèle de l'objet",
                defaultValue: '',
                maxCharacters: 50,
            },
            input => {
                if (!input) {
                    return Ok(null);
                }

                const model = input.trim();
                const modelHash = GetHashKey(model);

                if (!IsModelInCdimage(modelHash) || !IsModelValid(modelHash)) {
                    return Err("Ce modèle n'existe pas");
                }

                return Ok(model);
            }
        );

        if (!model) {
            return;
        }

        const modelHash = GetHashKey(model);
        const object = await this.objectEditorProvider.createOrUpdateObject(modelHash, {
            allowToggleCollision: true,
            allowToggleSnap: true,
            allowAddEffect: true,
            allowTogglePermanent: true,
            context: this.currentSceneEdited?.context,
        });

        if (!object) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_ADD_ENTITY, sceneId, model, object);
    }

    @OnNuiEvent(NuiEvent.SceneDuplicateEntity)
    async onNuiDuplicateSceneEntity({ sceneId, entityId }: { sceneId: string; entityId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const entity = scene.entities[entityId];

        if (!entity) {
            return;
        }

        const object = await this.objectEditorProvider.createOrUpdateObject(entity.object.model, {
            allowToggleCollision: true,
            allowToggleSnap: true,
            allowAddEffect: true,
            allowTogglePermanent: true,
            context: this.currentSceneEdited?.context,
        });

        if (!object) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_ADD_ENTITY, sceneId, entity.model, object);
    }

    @OnNuiEvent(NuiEvent.SceneUpdateEntity)
    async onNuiUpdateSceneEntity({ sceneId, entityId }: { sceneId: string; entityId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const entity = scene.entities[entityId];

        if (!entity) {
            return;
        }

        const object = await this.objectEditorProvider.createOrUpdateObject(
            entity.object.model,
            {
                allowToggleCollision: true,
                allowToggleSnap: true,
                allowAddEffect: true,
                allowTogglePermanent: true,
                context: this.currentSceneEdited?.context,
            },
            entity.object
        );

        if (!object) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_UPDATE_ENTITY, sceneId, entityId, object);
    }

    @OnNuiEvent(NuiEvent.SceneRemoveEntity)
    async onNuiDeleteSceneEntity({ sceneId, entityId }: { sceneId: string; entityId: string }) {
        TriggerServerEvent(ServerEvent.SCENE_REMOVE_ENTITY, sceneId, entityId);
    }

    @OnNuiEvent(NuiEvent.SceneAddPed)
    async onNuiAddScenePed({ sceneId }: { sceneId: string }) {
        const model = await this.inputService.askInput<string>(
            {
                title: 'Modèle du ped',
                defaultValue: '',
                maxCharacters: 50,
            },
            input => {
                if (!input) {
                    return Ok(null);
                }

                const model = input.trim();
                const modelHash = GetHashKey(model);

                if (!IsModelInCdimage(modelHash) || !IsModelValid(modelHash) || !IsModelAPed(modelHash)) {
                    return Err("Ce modèle n'existe pas");
                }

                return Ok(model);
            }
        );

        if (!model) {
            return;
        }

        const object = await this.objectEditorProvider.createOrUpdateObject(GetHashKey('prop_ped_gib_01'), {
            allowToggleCollision: false,
            allowToggleSnap: true,
            allowAddEffect: false,
            allowTogglePermanent: false,
            snapToGround: true,
            context: this.currentSceneEdited?.context,
        });

        if (!object) {
            return;
        }

        const data: ScenePedData = {
            behavior: ScenePedBehavior.passive,
            model,
            position: [object.position[0], object.position[1], object.position[2] - 1, object.position[3] + 180],
            weapon: WeaponName.UNARMED,
        };

        TriggerServerEvent(ServerEvent.SCENE_ADD_PED, sceneId, data);
    }

    @OnNuiEvent(NuiEvent.SceneUpdatePosition)
    async onNuiSetSceneUpdatePosition({ sceneId, pedId }: { sceneId: string; pedId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const ped = scene.peds[pedId];

        if (!ped) {
            return;
        }

        const object = await this.objectEditorProvider.createOrUpdateObject(
            GetHashKey('prop_ped_gib_01'),
            {
                allowToggleCollision: false,
                allowToggleSnap: true,
                allowAddEffect: false,
                allowTogglePermanent: false,
                snapToGround: true,
                context: this.currentSceneEdited?.context,
            },
            {
                id: uuidv4(),
                model: GetHashKey('prop_ped_gib_01'),
                position: [ped.position[0], ped.position[1], ped.position[2] + 1, ped.position[3] + 180],
            }
        );

        if (!object) {
            return;
        }

        const delta: Partial<ScenePedData> = {
            position: [object.position[0], object.position[1], object.position[2] - 1, object.position[3] + 180],
        };

        TriggerServerEvent(ServerEvent.SCENE_UPDATE_PED, sceneId, pedId, delta);
    }

    @OnNuiEvent(NuiEvent.SceneDuplicatePed)
    async onNuiSetSceneDuplicatePed({ sceneId, pedId }: { sceneId: string; pedId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const ped = scene.peds[pedId];

        if (!ped) {
            return;
        }

        const object = await this.objectEditorProvider.createOrUpdateObject(GetHashKey('prop_ped_gib_01'), {
            allowToggleCollision: true,
            allowToggleSnap: true,
            allowAddEffect: true,
            allowTogglePermanent: false,
            context: this.currentSceneEdited?.context,
        });

        if (!object) {
            return;
        }

        const data: ScenePedData = {
            behavior: ped.behavior,
            model: ped.model,
            position: [object.position[0], object.position[1], object.position[2] - 1, object.position[3] + 180],
            weapon: ped.weapon,
        };

        TriggerServerEvent(ServerEvent.SCENE_ADD_PED, sceneId, data);
    }

    @OnNuiEvent(NuiEvent.SceneRemovePed)
    async onNuiSetSceneRemovePed({ sceneId, pedId }: { sceneId: string; pedId: string }) {
        TriggerServerEvent(ServerEvent.SCENE_REMOVE_PED, sceneId, pedId);
    }

    @OnNuiEvent(NuiEvent.SceneSetPedWeapon)
    async onNuiSetSceneSetPedWeapon({ sceneId, pedId }: { sceneId: string; pedId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const ped = scene.peds[pedId];

        if (!ped) {
            return;
        }

        const weapon = await this.inputService.askInput(
            {
                title: 'Arme du pnj',
                defaultValue: ped.weapon,
            },
            input => {
                if (!input) {
                    return Ok(null);
                }

                for (const weapon of Object.values(WeaponName)) {
                    if (weapon.toLowerCase() === input.toLowerCase()) {
                        return Ok(weapon);
                    }
                }

                return Err("Cette arme n'existe pas");
            }
        );

        if (!weapon) {
            return;
        }

        const delta: Partial<ScenePedData> = {
            weapon,
        };

        TriggerServerEvent(ServerEvent.SCENE_UPDATE_PED, sceneId, pedId, delta);
    }

    @OnNuiEvent(NuiEvent.SceneSetPedBehavior)
    async onNuiSetSceneSetPedBehavior({ sceneId, pedId }: { sceneId: string; pedId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const ped = scene.peds[pedId];

        if (!ped) {
            return;
        }

        const behavior = await this.inputService.askInput(
            {
                title: 'Comportement du pnj',
                defaultValue: ped.behavior,
            },
            input => {
                if (!input) {
                    return Ok(null);
                }

                for (const weapon of Object.values(ScenePedBehavior)) {
                    if (weapon === input.toLowerCase()) {
                        return Ok(weapon);
                    }
                }

                return Err(`Comportement inconnu, valeurs possibles: ${Object.values(ScenePedBehavior).join(',')}`);
            }
        );

        if (!behavior) {
            return;
        }

        const delta: Partial<ScenePedData> = {
            behavior,
        };

        TriggerServerEvent(ServerEvent.SCENE_UPDATE_PED, sceneId, pedId, delta);
    }

    @OnNuiEvent(NuiEvent.SceneSetPersistent)
    async onNuiSceneSetPersistent({ sceneId, persist }: { sceneId: string; persist: boolean }) {
        TriggerServerEvent(ServerEvent.SCENE_SET_PERSISTENT, sceneId, persist);
    }

    @OnNuiEvent(NuiEvent.SceneSetName)
    async onNuiSceneSetName({ sceneId }: { sceneId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const name = await this.inputService.askInput(
            {
                title: 'Nom de la scène',
                defaultValue: scene.name,
                maxCharacters: 50,
            },
            NotEmptyStringValidator
        );

        if (!name) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_SET_NAME, sceneId, name);
    }

    @OnNuiEvent(NuiEvent.SceneTeleport)
    async onNuiSceneTeleport({ sceneId }: { sceneId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const [firstProp] = Object.values(scene.entities);

        if (firstProp) {
            await this.playerPositionProvider.teleportAdminToPosition(firstProp.object.position);
        }
    }

    @OnNuiEvent(NuiEvent.SceneLoad)
    async onNuiSceneLoad({ sceneId }: { sceneId: string }) {
        TriggerServerEvent(ServerEvent.SCENE_LOAD, sceneId);
    }

    @OnNuiEvent(NuiEvent.SceneUnload)
    async onNuiSceneUnload({ sceneId }: { sceneId: string }) {
        TriggerServerEvent(ServerEvent.SCENE_UNLOAD, sceneId);
    }

    @OnNuiEvent(NuiEvent.SceneSetEntityInventory)
    public async setInventoryId({
        sceneId,
        entityId,
        remove,
    }: {
        sceneId: string;
        entityId: string;
        remove?: boolean;
    }) {
        if (remove) {
            TriggerServerEvent(ServerEvent.SCENE_SET_ENTITY_INVENTORY, sceneId, entityId, null);

            return;
        }

        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const entity = scene.entities[entityId];

        if (!entity) {
            return;
        }

        const inventoryId = await this.inputService.askInput(
            {
                title: "ID de l'inventaire",
                maxCharacters: 50,
                defaultValue: entity.inventoryId || uuidv4(),
            },
            NotEmptyStringValidator
        );

        if (!inventoryId) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_SET_ENTITY_INVENTORY, sceneId, entityId, inventoryId);
    }

    @RepositoryUpdate(RepositoryType.Scene)
    async onSceneUpdate(scene: Scene, previousScene: Scene) {
        const sceneInEdition = this.currentSceneEdited?.scene.id === scene.id;
        const wasLoaded = sceneInEdition || this.loadedScenes.has(scene.id);
        await this.doUnloadScene(previousScene);

        if (!wasLoaded) {
            return;
        }

        await this.doLoadScene(scene, sceneInEdition);

        if (sceneInEdition) {
            await this.applyHighlight(scene);
        }
    }

    @RepositoryDelete(RepositoryType.Scene)
    async onSceneDelete(scene: Scene) {
        await this.unloadScene(scene.id);
    }

    @OnEvent(ClientEvent.SCENE_LOAD)
    async loadScene(sceneId: string) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        if (this.currentSceneEdited?.scene.id !== sceneId) {
            await this.doLoadScene(scene);
        }

        this.loadedScenes.add(sceneId);
    }

    async doLoadScene(scene: Scene, editing = false) {
        for (const entity of Object.values(scene.entities)) {
            const targets: TargetOption[] = [];

            if (entity.inventoryId && !editing) {
                targets.push({
                    label: 'Ouvrir',
                    icon: 'inventory/ouvrir_le_stockage',
                    category: 'criminal',
                    canInteract: () => true,
                    action: () => {
                        this.inventoryManager.openInventory('object_storage', entity.inventoryId);
                    },
                });

                targets.push({
                    label: "Signaler l'emplacement",
                    icon: 'inventory/ouvrir_le_stockage',
                    job: FDO.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {} as Record<JobType, number>),
                    category: 'society',
                    canInteract: () => !this.worldEventProvider.isSignaled(entity.inventoryId),
                    action: async () => {
                        const progress = await this.progressService.progress(
                            'world_event_signal',
                            'Signalement en cours...',
                            180_000,
                            {
                                dictionary: 'Rcm_epsilonism4',
                                name: 'eps_4_ig_1_jimmy_lookaround_idle_a_jb',
                                options: { repeat: true },
                            },
                            {}
                        );
                        if (!progress.completed) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.WORLD_EVENT_SIGNAL_INVENTORY, entity.inventoryId);
                    },
                });
            }

            await this.objectProvider.createObject(
                {
                    ...{
                        ...entity.object,
                        vfx: this.worldEventProvider.isSignaled(entity.inventoryId) ? null : entity.object.vfx,
                    },
                    alpha: editing ? 200 : null,
                },
                targets
            );
        }

        if (editing) {
            for (const ped of Object.values(scene.peds)) {
                await this.pedFactory.createPedOnGrid({
                    id: ped.id,
                    coords: toVector4Object(ped.position),
                    model: ped.model,
                    weapon: ped.weapon,
                    alpha: 200,
                    freeze: true,
                    blockevents: true,
                });
            }
        }
    }

    @OnEvent(ClientEvent.SCENE_UNLOAD)
    async unloadScene(sceneId: string) {
        const scene = this.sceneRepository.find(sceneId);
        this.loadedScenes.delete(sceneId);

        if (!scene) {
            return;
        }

        if (this.currentSceneEdited?.scene.id === sceneId) {
            return;
        }

        await this.doUnloadScene(scene);
    }

    async doUnloadScene(scene: Scene) {
        if (!scene) {
            return;
        }

        const objectIds = [];

        for (const entity of Object.values(scene.entities)) {
            objectIds.push(entity.object.id);
        }

        this.objectProvider.deleteObjects(objectIds);

        for (const ped of Object.values(scene.peds)) {
            this.pedFactory.deletePedOnGrid(ped.id);
        }
    }
}
