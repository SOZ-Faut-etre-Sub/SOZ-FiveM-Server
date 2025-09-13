import { MinigameProvider } from '@private/client/minigames/minigames.provider';
import { Command } from '@public/core/decorators/command';
import { toVector4Object } from '@public/shared/polyzone/vector';
import { WeaponName } from '@public/shared/weapons/weapon';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { RepositoryDelete, RepositoryUpdate } from '../../core/decorators/repository';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { uuidv4 } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { InventoryType } from '../../shared/inventory';
import { FDO, JobType } from '../../shared/job';
import { NotEmptyStringValidator } from '../../shared/nui/input';
import { MenuType } from '../../shared/nui/menu';
import { PlacementProp } from '../../shared/nui/prop_placement';
import { ObjectEditorContext } from '../../shared/object';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { RepositoryType } from '../../shared/repository';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import {
    Scene,
    SceneEntity,
    SceneMarker,
    SceneMarkerData,
    ScenePed,
    ScenePedBehavior,
    ScenePedData,
} from '../../shared/scene';
import { TargetOption } from '../../shared/target';
import { AnimationService } from '../animation/animation.service';
import { FlyingCameraProvider } from '../camera/flying.camera.provider';
import { PedFactory } from '../factory/ped.factory';
import { InventoryManager } from '../inventory/inventory.manager';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { ObjectEditorProvider } from '../object/object.editor.provider';
import { ObjectProvider } from '../object/object.provider';
import { ObjectService } from '../object/object.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { ResourceLoader } from '../repository/resource.loader';
import { SceneRepository } from '../repository/scene.repository';
import { ScreenService } from '../screen.service';
import { WorldEventProvider } from '../world/world.event.provider';

type CurrentSceneEdited = {
    scene: Scene;
    context: ObjectEditorContext;
};

const MAX_DISTANCE_FLYING_CAMERA = 60;

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

    @Inject(MinigameProvider)
    private minigameProvider: MinigameProvider;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(FlyingCameraProvider)
    private flyingCameraProvider: FlyingCameraProvider;

    @Inject(ScreenService)
    private screenService: ScreenService;

    @Inject(ObjectService)
    private objectService: ObjectService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private highlightedObjectId: string = null;

    private targetedObjectId: string = null;

    private loadedScenes = new Set<string>();

    private currentSceneEdited: CurrentSceneEdited = null;

    private camera: number;

    private nextPreviewProp;

    private previewEntity: number | null = null;

    private loadingScenePromises: Map<string, Promise<void>> = new Map();

    public isEditingScene(): boolean {
        return this.currentSceneEdited !== null;
    }

    @OnEvent(ClientEvent.PROP_OPEN_MENU)
    public async openPlacementMenu() {
        this.nuiMenu.openMenu(MenuType.PropPlacementMenu, {
            loaded: [...this.loadedScenes],
        });
    }

    @OnNuiEvent(NuiEvent.RequestCreatePropCollection)
    public async onRequestCreatePropCollection() {
        const name = await this.inputService.askInput({
            title: 'Nom de la collection',
            maxCharacters: 50,
        });
        if (!name) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_CREATE, name);
    }

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

        this.currentSceneEdited = {
            scene,
            context,
        };
        this.highlightedObjectId = null;

        if (!this.camera) {
            this.camera = this.flyingCameraProvider.createCamera();
            this.flyingCameraProvider.setRestrictionLogic((oldPosition, newPosition) => {
                const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

                if (getDistance(position, newPosition) > MAX_DISTANCE_FLYING_CAMERA) {
                    return oldPosition;
                }

                return newPosition;
            });
        }

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

        const currentScene = this.currentSceneEdited.scene;

        this.flyingCameraProvider.deleteCamera();
        this.camera = null;
        this.currentSceneEdited = null;

        if (!this.loadedScenes.has(currentScene.id)) {
            await this.doUnloadScene(currentScene);
        }

        if (this.loadedScenes.has(currentScene.id)) {
            // reload scene if necessary without highlight
            await this.doLoadScene(currentScene);
            await this.applyHighlight(currentScene);
        }
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
                this.nuiMenu.getOpened() !== MenuType.ObjectEditor &&
                ((this.highlightedObjectId === null && this.targetedObjectId === null) ||
                    this.highlightedObjectId === sceneEntity.id ||
                    this.targetedObjectId === sceneEntity.id)
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

        for (const sceneMarker of Object.values(scene.markers)) {
            const entity = this.objectProvider.getEntityFromId(sceneMarker.id);

            if (!entity) {
                continue;
            }

            if (
                this.currentSceneEdited?.scene?.id === scene.id &&
                this.nuiMenu.getOpened() !== MenuType.ObjectEditor &&
                ((this.highlightedObjectId === null && this.targetedObjectId === null) ||
                    this.highlightedObjectId === sceneMarker.id ||
                    this.targetedObjectId === sceneMarker.id)
            ) {
                SetEntityDrawOutlineColor(0, 180, 0, 255);
                SetEntityDrawOutlineShader(1);
                SetEntityDrawOutline(entity, true);
            } else {
                SetEntityDrawOutline(entity, false);
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

    @OnNuiEvent(NuiEvent.ScenePreviewModel)
    async onNuiPreviewModelForScene({ prop }: { prop: PlacementProp | null }) {
        this.nextPreviewProp = prop;
    }

    @OnNuiEvent(NuiEvent.SceneSearchEntity)
    async onNuiSearchSceneEntity() {
        this.nuiDispatch.dispatch('scene', 'ShowSearch', 'https://gtahash.ru/');
    }

    @OnNuiEvent(NuiEvent.SceneAddEntity)
    async onNuiAddSceneEntity({ sceneId, model }: { sceneId: string; model?: string }) {
        if (!model) {
            model = await this.inputService.askInput<string>(
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
        }

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
            useCircularCamera: false,
            initialPosition: this.getCoordForNewEntity(),
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
            useCircularCamera: false,
        });

        if (!object) {
            return;
        }

        const userId = entity.userId ? await this.doAskUserId(scene, entity.userId) : null;

        TriggerServerEvent(ServerEvent.SCENE_ADD_ENTITY, sceneId, entity.model, object, userId);
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

        return await this.updateEntity(sceneId, scene, entity);
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
            allowAddEffect: false,
            allowTogglePermanent: false,
            snapToGround: true,
            context: this.currentSceneEdited?.context,
            useCircularCamera: false,
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
                allowAddEffect: false,
                allowTogglePermanent: false,
                snapToGround: true,
                context: this.currentSceneEdited?.context,
                useCircularCamera: false,
                deleteCallback: () => {
                    TriggerServerEvent(ServerEvent.SCENE_REMOVE_PED, sceneId, pedId);
                },
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

    @OnNuiEvent(NuiEvent.SceneAddMarker)
    async onNuiAddSceneMarker({ sceneId }: { sceneId: string }) {
        const userId = await this.inputService.askInput({
            title: 'Identifiant du marqueur',
            defaultValue: '',
            maxCharacters: 50,
        });

        if (!userId) {
            return;
        }

        const position = this.getCoordForNewEntity();

        const object = await this.objectEditorProvider.createOrUpdateObject(
            GetHashKey('prop_pool_ball_01'),
            {
                allowToggleCollision: false,
                allowToggleSnap: true,
                allowAddEffect: false,
                allowTogglePermanent: false,
                allowRotation: false,
                allowDuplicate: false,
                allowScale: false,
                allowDelete: true,

                context: this.currentSceneEdited?.context,
                useCircularCamera: false,
                initialPosition: position,
            },
            {
                id: uuidv4(),
                model: GetHashKey('prop_pool_ball_01'),
                position: position,
            }
        );

        if (!object) {
            return;
        }

        const data: SceneMarkerData = {
            position: [object.position[0], object.position[1], object.position[2], object.position[3]],
        };

        TriggerServerEvent(ServerEvent.SCENE_ADD_MARKER, sceneId, userId, data);
    }

    @OnNuiEvent(NuiEvent.SceneUpdateMarker)
    async onNuiSetSceneUpdateMarker({ sceneId, markerId }: { sceneId: string; markerId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const marker = scene.markers[markerId];

        if (!marker) {
            return;
        }

        return await this.updateMarker(sceneId, marker);
    }

    @OnNuiEvent(NuiEvent.SceneRemoveMarker)
    async onNuiRemoveSceneMarker({ sceneId, markerId }: { sceneId: string; markerId: string }) {
        TriggerServerEvent(ServerEvent.SCENE_REMOVE_MARKER, sceneId, markerId);
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
            useCircularCamera: false,
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
            let previousRestrictionLogic = null;

            if (this.camera) {
                previousRestrictionLogic = this.flyingCameraProvider.setRestrictionLogic(null);
            }

            const previousPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;

            await this.playerPositionProvider.teleportAdminToPosition(firstProp.object.position);

            if (this.camera) {
                this.flyingCameraProvider.handleCameraPosition(previousPosition, [
                    firstProp.object.position[0],
                    firstProp.object.position[1],
                    firstProp.object.position[2],
                ]);
                this.flyingCameraProvider.setRestrictionLogic(previousRestrictionLogic);
            }
        }
    }

    @OnNuiEvent(NuiEvent.SceneLoad)
    async onNuiSceneLoad({ sceneId }: { sceneId: string }) {
        this.nuiMenu.closeMenu();

        const { completed } = await this.progressService.progress(
            'prop_toggle_load',
            'Chargement de la collection...',
            5000
        );

        if (!completed) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_LOAD, sceneId);
    }

    @OnNuiEvent(NuiEvent.SceneUnload)
    async onNuiSceneUnload({ sceneId }: { sceneId: string }) {
        this.nuiMenu.closeMenu();

        const { completed } = await this.progressService.progress(
            'prop_toggle_load',
            'Déchargement de la collection...',
            5000
        );

        if (!completed) {
            return;
        }

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

    @OnNuiEvent(NuiEvent.SceneSetEntityUserId)
    public async setUserId({ sceneId, entityId }: { sceneId: string; entityId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const entity = scene.entities[entityId];

        if (!entity) {
            return;
        }

        const userId = await this.doAskUserId(scene);

        if (!userId) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_ENTITY_SET_USER_ID, sceneId, entityId, userId);
    }

    @RepositoryUpdate(RepositoryType.Scene)
    async onSceneUpdate(scene: Scene, previousScene: Scene) {
        const sceneInEdition = this.currentSceneEdited?.scene.id === scene.id;
        const wasLoaded = sceneInEdition || this.loadedScenes.has(scene.id);

        if (!wasLoaded) {
            return;
        }

        const objectsToAddOrUpdate = [];
        const pedsToAddOrUpdate = [];
        const markersToAddOrUpdate = [];

        const previousEntitiesId = Object.keys(previousScene.entities);
        const previousPedsId = Object.keys(previousScene.peds);
        const previousMarkersId = Object.keys(previousScene.markers);

        for (const entity of Object.values(scene.entities)) {
            objectsToAddOrUpdate.push(entity);

            if (previousEntitiesId.includes(entity.id)) {
                previousEntitiesId.splice(previousEntitiesId.indexOf(entity.id), 1);
            }
        }

        for (const ped of Object.values(scene.peds)) {
            pedsToAddOrUpdate.push(ped);

            if (previousPedsId.includes(ped.id)) {
                previousPedsId.splice(previousPedsId.indexOf(ped.id), 1);
            }
        }

        for (const marker of Object.values(scene.markers)) {
            markersToAddOrUpdate.push(marker);

            if (previousScene.markers[marker.id]) {
                delete previousScene.markers[marker.id];
            }
        }

        // Remove old entities and peds
        if (previousEntitiesId.length > 0) {
            this.objectProvider.deleteObjects(previousEntitiesId);
        }

        for (const pedId of previousPedsId) {
            this.pedFactory.deletePedOnGrid(pedId);
        }

        if (previousMarkersId.length > 0) {
            this.objectProvider.deleteObjects(previousMarkersId);
        }

        for (const entity of objectsToAddOrUpdate) {
            await this.loadSceneEntity(entity, sceneInEdition);
        }

        if (sceneInEdition) {
            for (const ped of pedsToAddOrUpdate) {
                await this.loadScenePed(ped);
            }

            for (const marker of markersToAddOrUpdate) {
                await this.loadSceneMarker(marker);
            }

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
        const existingPromise = this.loadingScenePromises.get(scene.id);

        if (existingPromise) {
            return existingPromise;
        }

        let resolvePromise: () => void;
        const newPromise = new Promise<void>(resolve => {
            resolvePromise = resolve;
        });

        this.loadingScenePromises.set(scene.id, newPromise);

        for (const entity of Object.values(scene.entities)) {
            await this.loadSceneEntity(entity, editing);
        }

        if (editing) {
            for (const ped of Object.values(scene.peds)) {
                await this.loadScenePed(ped);
            }

            for (const marker of Object.values(scene.markers)) {
                await this.loadSceneMarker(marker);
            }
        }

        resolvePromise();
        this.loadingScenePromises.delete(scene.id);
    }

    async loadScenePed(ped: ScenePed) {
        if (this.pedFactory.hasPed(ped.id)) {
            await this.pedFactory.deletePedOnGrid(ped.id);
        }

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

    async loadSceneMarker(marker: SceneMarker) {
        if (this.objectProvider.hasObject(marker.id)) {
            await this.objectProvider.updateObject({
                id: marker.id,
                model: GetHashKey('prop_pool_ball_01'),
                position: marker.position,
                alpha: 200,
            });
        } else {
            await this.objectProvider.createObject({
                id: marker.id,
                model: GetHashKey('prop_pool_ball_01'),
                position: marker.position,
                alpha: 200,
            });
        }
    }

    async loadSceneEntity(entity: SceneEntity, editing = false) {
        const targets: TargetOption[] = [];

        if (entity.inventoryId && !editing) {
            targets.push({
                label: 'Ouvrir',
                icon: 'inventory/ouvrir_le_stockage',
                category: 'criminal',
                canInteract: () =>
                    this.worldEventProvider.isUnlock(entity.inventoryId) &&
                    !this.worldEventProvider.isSignaled(entity.inventoryId),
                action: () => {
                    this.inventoryManager.openInventory(
                        InventoryType.ObjectStorage,
                        entity.inventoryId,
                        entity.object.position
                    );
                },
            });

            targets.push({
                label: 'Dévérouiller',
                icon: 'crimi/unlock',
                category: 'criminal',
                canInteract: () =>
                    !this.worldEventProvider.isUnlock(entity.inventoryId) &&
                    !this.worldEventProvider.isSignaled(entity.inventoryId),
                action: async () => {
                    const anim = this.animationService.playAnimation({
                        enter: {
                            dictionary: 'anim@heists@humane_labs@emp@hack_door',
                            name: 'hack_intro',
                            duration: 6433,
                            options: {
                                onlyUpperBody: true,
                            },
                        },
                        base: {
                            dictionary: 'anim@heists@humane_labs@emp@hack_door',
                            name: 'hack_loop',
                            options: {
                                repeat: true,
                                onlyUpperBody: true,
                            },
                        },
                        exit: {
                            dictionary: 'anim@heists@humane_labs@emp@hack_door',
                            name: 'hack_outro',
                            duration: 4033,
                            options: {
                                onlyUpperBody: true,
                            },
                        },
                        props: [
                            {
                                bone: 28422,
                                model: 'prop_police_phone',
                                position: [0.0, 0.0, 0.0301],
                                rotation: [0.0, 0.0, 0.0],
                            },
                        ],
                    });
                    const success = await this.minigameProvider.runGame('ShowPincraker', {
                        delay: 20,
                        nbDigit: 3,
                    });

                    if (success) {
                        TriggerServerEvent(ServerEvent.WORLD_EVENT_UNLOCK_INVENTORY, entity.inventoryId);
                    }
                    anim.cancel();
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
                        GetConvar('soz_core_environment', 'development') == 'production' ? 180_000 : 10_000,
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

        if (this.objectProvider.hasObject(entity.id)) {
            await this.objectProvider.updateObject(
                {
                    ...{
                        ...entity.object,
                        vfx: this.worldEventProvider.isSignaled(entity.inventoryId) ? null : entity.object.vfx,
                    },
                    alpha: editing ? 200 : 255,
                },
                targets
            );
        } else {
            await this.objectProvider.createObject(
                {
                    ...{
                        ...entity.object,
                        vfx: this.worldEventProvider.isSignaled(entity.inventoryId) ? null : entity.object.vfx,
                    },
                    alpha: editing ? 200 : 255,
                },
                targets
            );
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

        const existingPromise = this.loadingScenePromises.get(scene.id);

        if (existingPromise) {
            await existingPromise;
        }

        // It was loaded while waiting for the promise, so we don't need to unload it
        if (this.loadedScenes.has(scene.id) || this.currentSceneEdited?.scene.id === scene.id) {
            return;
        }

        const objectIds = [];

        for (const entity of Object.values(scene.entities)) {
            objectIds.push(entity.object.id);
        }

        this.objectProvider.deleteObjects(objectIds);

        for (const ped of Object.values(scene.peds)) {
            await this.pedFactory.deletePedOnGrid(ped.id);
        }

        this.objectProvider.deleteObjects(Object.keys(scene.markers));
    }

    @OnNuiEvent(NuiEvent.SceneSelectObjectOnClick)
    async selectObjectOnClick() {
        if (null === this.currentSceneEdited || !IsNuiFocused()) {
            return;
        }

        const entityOnMouse = await this.getEntityFromMouse();

        if (!entityOnMouse) {
            return;
        }

        const objectId = this.objectProvider.getIdFromEntity(entityOnMouse);

        if (!objectId) {
            return;
        }

        const sceneEntity = this.currentSceneEdited?.scene.entities[objectId] ?? null;

        if (sceneEntity) {
            return await this.updateEntity(
                this.currentSceneEdited.scene.id,
                this.currentSceneEdited.scene,
                sceneEntity
            );
        }

        const sceneMarker = this.currentSceneEdited?.scene.markers[objectId] ?? null;

        if (sceneMarker) {
            return await this.updateMarker(this.currentSceneEdited.scene.id, sceneMarker);
        }
    }

    @OnNuiEvent(NuiEvent.SceneAddAssociate)
    async addAssociate({ sceneId }: { sceneId: string }) {
        const scene = this.sceneRepository.find(sceneId);

        if (!scene) {
            return;
        }

        const phone = await this.inputService.askInput(
            {
                title: 'Téléphone du joueur',
                defaultValue: '555-',
                maxCharacters: 50,
            },
            NotEmptyStringValidator
        );

        if (!phone) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_ADD_ASSOCIATE, sceneId, phone);
    }

    @OnNuiEvent(NuiEvent.SceneRemoveAssociate)
    async removeAssociate({ sceneId, associateId }: { sceneId: string; associateId: string }) {
        TriggerServerEvent(ServerEvent.SCENE_REMOVE_ASSOCIATE, sceneId, associateId);
    }

    @OnNuiEvent(NuiEvent.SceneTransferOwnership)
    async transferOwnership({ sceneId, associateId }: { sceneId: string; associateId: string }) {
        TriggerServerEvent(ServerEvent.SCENE_TRANSFER_OWNER, sceneId, associateId);
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handlePreviewEntity() {
        if (null === this.currentSceneEdited) {
            if (this.previewEntity) {
                if (DoesEntityExist(this.previewEntity)) {
                    DeleteEntity(this.previewEntity);
                }
                this.previewEntity = null;
            }

            return;
        }

        if (this.nextPreviewProp === null && this.previewEntity) {
            if (DoesEntityExist(this.previewEntity)) {
                DeleteEntity(this.previewEntity);
            }

            this.previewEntity = null;
        }

        const position = this.getCoordForNewEntity();

        // If next entity changed or previewEntity is null, create a new one
        if (
            this.nextPreviewProp &&
            (this.previewEntity === null ||
                GetEntityModel(this.previewEntity) !== GetHashKey(this.nextPreviewProp.model))
        ) {
            if (this.previewEntity && DoesEntityExist(this.previewEntity)) {
                DeleteEntity(this.previewEntity);
            }

            this.previewEntity = await this.objectService.createObject({
                model: GetHashKey(this.nextPreviewProp.model),
                position,
                id: uuidv4(),
                noCollision: true,
            });
        }

        if (!this.previewEntity || !DoesEntityExist(this.previewEntity)) {
            return;
        }

        SetEntityCoords(this.previewEntity, position[0], position[1], position[2], false, false, false, false);
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleMouseSelection() {
        if (null === this.currentSceneEdited || !IsNuiFocused()) {
            if (this.targetedObjectId) {
                this.targetedObjectId = null;
                await this.applyHighlight(this.currentSceneEdited.scene);
            }

            return;
        }

        const entityOnMouse = await this.getEntityFromMouse();

        if (!entityOnMouse) {
            if (this.targetedObjectId) {
                this.targetedObjectId = null;
                await this.applyHighlight(this.currentSceneEdited.scene);
            }

            return;
        }

        const objectId = this.objectProvider.getIdFromEntity(entityOnMouse);

        if (!objectId) {
            if (this.targetedObjectId) {
                this.targetedObjectId = null;
                await this.applyHighlight(this.currentSceneEdited.scene);
            }

            return;
        }

        const sceneEntity = this.currentSceneEdited.scene.entities[objectId] ?? null;
        const sceneMarker = this.currentSceneEdited.scene.markers[objectId] ?? null;

        if (sceneEntity) {
            if (sceneEntity.object.id !== this.targetedObjectId) {
                this.targetedObjectId = objectId;
                await this.applyHighlight(this.currentSceneEdited.scene);
            }

            return;
        }

        if (sceneMarker) {
            if (sceneMarker.id !== this.targetedObjectId) {
                this.targetedObjectId = objectId;
                await this.applyHighlight(this.currentSceneEdited.scene);
            }

            return;
        }

        if (this.targetedObjectId) {
            this.targetedObjectId = null;
            await this.applyHighlight(this.currentSceneEdited.scene);
        }

        return;
    }

    private async getEntityFromMouse() {
        const [screenX, screenY] = GetActiveScreenResolution();
        const [x, y] = GetNuiCursorPosition();

        const cameraPosition = GetCamCoord(this.camera) as Vector3;
        const cameraRotation = GetCamRot(this.camera, 0) as Vector3;

        const [hitEntDebug] = await this.screenService.getEntityOnPosition(
            [x / screenX, y / screenY],
            cameraPosition,
            cameraRotation
        );
        return hitEntDebug;
    }

    private getCoordForNewEntity(): Vector4 {
        let position = GetEntityCoords(PlayerPedId(), true) as Vector3;
        let heading = GetEntityHeading(PlayerPedId());

        if (this.camera) {
            position = GetCamCoord(this.camera) as Vector3;
            heading = GetCamRot(this.camera, 0)[2];
        }

        return [
            ...GetObjectOffsetFromCoords(position[0], position[1], position[2] - 0.8, heading, 0, 2.5, 0),
            0,
        ] as Vector4;
    }

    public async updateEntity(sceneId: string, scene: Scene, sceneEntity: SceneEntity) {
        const object = await this.objectEditorProvider.createOrUpdateObject(
            sceneEntity.object.model,
            {
                allowToggleCollision: true,
                allowToggleSnap: true,
                allowAddEffect: true,
                allowTogglePermanent: true,
                context: this.currentSceneEdited?.context,
                useCircularCamera: false,
                allowDuplicate: true,
                allowDelete: true,
                allowSetName: true,
                deleteCallback: () => {
                    TriggerServerEvent(ServerEvent.SCENE_REMOVE_ENTITY, sceneId, sceneEntity.id);
                },
                setNameCallback: (_, name) => {
                    TriggerServerEvent(ServerEvent.SCENE_ENTITY_SET_USER_ID, sceneId, sceneEntity.id, name);
                },
            },
            sceneEntity.object
        );

        if (!object) {
            return;
        }

        if (sceneEntity.id !== object.id) {
            const userId = sceneEntity.userId ? await this.doAskUserId(scene, sceneEntity.userId) : null;

            TriggerServerEvent(ServerEvent.SCENE_ADD_ENTITY, sceneId, sceneEntity.model, object, userId);
        } else {
            TriggerServerEvent(ServerEvent.SCENE_UPDATE_ENTITY, sceneId, sceneEntity.id, object);
        }
    }

    public async updateMarker(sceneId: string, sceneMarker: SceneMarker) {
        const object = await this.objectEditorProvider.createOrUpdateObject(
            GetHashKey('prop_pool_ball_01'),
            {
                allowToggleCollision: false,
                allowToggleSnap: true,
                allowAddEffect: false,
                allowTogglePermanent: false,
                allowRotation: false,
                allowDuplicate: false,
                allowScale: false,
                allowDelete: true,
                context: this.currentSceneEdited?.context,
                useCircularCamera: false,
                deleteCallback: () => {
                    TriggerServerEvent(ServerEvent.SCENE_REMOVE_MARKER, sceneId, sceneMarker.id);
                },
                initialPosition: [
                    sceneMarker.position[0],
                    sceneMarker.position[1],
                    sceneMarker.position[2],
                    sceneMarker.position[3],
                ],
            },
            {
                id: sceneMarker.id,
                model: GetHashKey('prop_pool_ball_01'),
                position: [
                    sceneMarker.position[0],
                    sceneMarker.position[1],
                    sceneMarker.position[2],
                    sceneMarker.position[3],
                ],
            }
        );

        if (!object) {
            return;
        }

        const data: SceneMarkerData = {
            position: [object.position[0], object.position[1], object.position[2], object.position[3]],
        };

        TriggerServerEvent(ServerEvent.SCENE_UPDATE_MARKER, sceneId, sceneMarker.id, data);
    }

    async doAskUserId(scene: Scene, existingUserId?: string): Promise<string | null> {
        return await this.inputService.askInput(
            {
                title: "Identifiant de l'entité",
                defaultValue: existingUserId || '',
                maxCharacters: 50,
            },
            input => {
                if (!input) {
                    return Ok(null);
                }

                const existingUserId = Object.values(scene.entities).find(entity => entity.userId === input);

                if (existingUserId) {
                    return Err('Cet identifiant est déjà utilisé par une autre entité de la collection.');
                }

                return Ok(input);
            }
        );
    }

    public applyEntityNormalizedMatrix(entity: number, matrix: number[]) {
        const norm_R = Math.sqrt(matrix[0] ** 2 + matrix[1] ** 2 + matrix[2] ** 2);
        const norm_F = Math.sqrt(matrix[4] ** 2 + matrix[5] ** 2 + matrix[6] ** 2);
        const norm_U = Math.sqrt(matrix[8] ** 2 + matrix[9] ** 2 + matrix[10] ** 2);
        SetEntityMatrix(
            entity,
            matrix[4] / norm_R,
            matrix[5] / norm_R,
            matrix[6] / norm_R,
            matrix[0] / norm_F,
            matrix[1] / norm_F,
            matrix[2] / norm_F,
            matrix[8] / norm_U,
            matrix[9] / norm_U,
            matrix[10] / norm_U,
            matrix[12],
            matrix[13],
            matrix[14] // Position
        );
    }

    @Command('collection')
    public async collec(source: number, name: string) {
        const player = this.playerService.getPlayer();
        if (player.role !== 'admin') {
            return;
        }

        const scene = this.sceneRepository.find(name);
        const ret = [];

        for (const prop of Object.values(scene.entities)) {
            const entity = this.objectProvider.getEntityFromId(prop.object.id);
            if (!entity) {
                console.log('Unknown', prop.object.id, prop.model);
                continue;
            }

            const coords = GetEntityCoords(entity);
            this.applyEntityNormalizedMatrix(entity, prop.object.matrix);
            const quaternion = GetEntityQuaternion(entity);

            ret.push({
                model: prop.model,
                quaternion,
                coords,
                scaleX: 1.0,
                scaleZ: 1.0,
                noCollision: prop.object.noCollision,
            });
        }

        TriggerServerEvent(ServerEvent.PROP_DUMP_COLLECTION, scene.name, ret);
    }
}
