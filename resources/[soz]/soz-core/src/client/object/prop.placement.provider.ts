import { Once, OnceStep, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { uuidv4, wait } from '@public/core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PLACEMENT_PROP_LIST, PlacementProp } from '@public/shared/nui/prop_placement';
import {
    DebugProp,
    PropCollection,
    PropCollectionData,
    PropServerData,
    PropState,
    WorldObject,
    WorldPlacedProp,
} from '@public/shared/object';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { Err, Ok } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { ResourceLoader } from '../repository/resource.loader';
import { StateSelector } from '../store/store';
import { CircularCameraProvider } from './circular.camera.provider';
import { ObjectProvider } from './object.provider';
import { PropHighlightProvider } from './prop.highlight.provider';

export const PROP_MAX_DISTANCE = 50.0;

@Provider()
export class PropPlacementProvider {
    @Inject(NuiMenu)
    private menu: NuiMenu;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PropHighlightProvider)
    private highlightProvider: PropHighlightProvider;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(CircularCameraProvider)
    private circularCamera: CircularCameraProvider;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private debugProp: DebugProp | null;
    private isEditorModeOn: boolean;
    private currentCollection: PropCollection | null;
    private isMouseSelectionOn: boolean;
    private isPipetteOn: boolean;
    private snapMode?: boolean;
    private previousPosition?: Vector3;

    private debugProps: Record<string, DebugProp> = {};

    @Once(OnceStep.Start)
    public async onInit() {
        RegisterKeyMapping('+gizmoSelect', 'Gizmo : Sélectionner un axe.', 'MOUSE_BUTTON', 'MOUSE_LEFT');
        RegisterKeyMapping('+gizmoTranslation', 'Gizmo : Mode Translation', 'keyboard', 'T');
        RegisterKeyMapping('+gizmoRotation', 'Gizmo : Mode Rotation', 'keyboard', 'R');
        RegisterKeyMapping('+gizmoScale', 'Giszmo : Mode Scale', 'keyboard', 'S');
        RegisterKeyMapping('+gizmoLocal', 'Gizmo : Coordonnées locales', 'keyboard', 'L');
    }

    private resetEditortState() {
        this.debugProp = null;
        this.isEditorModeOn = false;
        this.currentCollection = null;
        this.isMouseSelectionOn = false;
        this.isPipetteOn = false;
        this.snapMode = false;
    }

    @OnEvent(ClientEvent.PROP_OPEN_MENU)
    public async openPlacementMenu() {
        if (this.menu.getOpened() === MenuType.PropPlacementMenu) {
            await this.doCloseEditor();
            this.menu.closeMenu();
            return;
        }
        const serverData = await emitRpc<PropServerData>(RpcServerEvent.PROP_GET_SERVER_DATA);
        const collections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_GET_COLLECTIONS_DATA);

        this.resetEditortState();
        this.menu.openMenu(MenuType.PropPlacementMenu, {
            props: PLACEMENT_PROP_LIST,
            serverData: serverData,
            collections: collections,
        });
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onCloseMenu({ menuType }) {
        if (menuType !== MenuType.PropPlacementMenu) {
            return;
        }
        await this.doCloseEditor();
    }

    @StateSelector(state => state.grid)
    public async onGridChange() {
        if (this.menu.getOpened() === MenuType.PropPlacementMenu) {
            this.notifier.notify('Changement de zone, fermeture du menu...', 'warning');
            await this.doCloseEditor();
            this.menu.closeMenu();
        }
    }

    public async doCloseEditor() {
        await this.onLeaveEditorMode();
        await this.onReturnToMainMenu();
        this.resetEditortState();
    }

    @OnNuiEvent(NuiEvent.PropPlacementReturnToMainMenu)
    public async onReturnToMainMenu() {
        if (this.currentCollection) {
            this.despawnDebugPropsOfCollection(this.currentCollection);
        }
        this.resetEditortState();
        this.highlightProvider.unhighlightAllEntities();
    }

    @OnNuiEvent(NuiEvent.RequestCreatePropCollection)
    public async onRequestCreatePropCollection() {
        const name = await this.inputService.askInput({
            title: 'Nom de la collection',
            defaultValue: '',
            maxCharacters: 50,
        });
        if (!name) {
            return;
        }
        const newCollections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_REQUEST_CREATE_COLLECTION, name);
        await this.refreshPropPlacementMenuData(newCollections);
    }

    @OnNuiEvent(NuiEvent.RequestDeletePropCollection)
    public async onRequestDeletePropCollection({ name }: { name: string }) {
        const result = await this.inputService.askConfirm(`Êtes-vous sûr de vouloir supprimer la collection ${name} ?`);
        if (!result) {
            return;
        }
        const newCollections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_REQUEST_DELETE_COLLECTION, name);
        if (!newCollections) {
            return;
        }

        this.despawnDebugPropsOfCollection(this.currentCollection);
        this.currentCollection = null;
        await this.refreshPropPlacementMenuData(newCollections);
    }

    public async refreshPropPlacementMenuData(
        propCollectionDatas?: PropCollectionData[],
        currentCollection?: PropCollection | null
    ) {
        if (propCollectionDatas) {
            this.nuiDispatch.dispatch('placement_prop', 'SetCollectionList', propCollectionDatas);
        }
        if (currentCollection) {
            this.nuiDispatch.dispatch('placement_prop', 'SetCollection', currentCollection);
        }
        this.nuiDispatch.dispatch('placement_prop', 'SetDatas', {
            serverData: await emitRpc<PropServerData>(RpcServerEvent.PROP_GET_SERVER_DATA),
        });
    }

    private async loadCurrentCollection() {
        if (!this.currentCollection) {
            this.notifier.notify('Impossible de charger ou décharger la collection.', 'error');
            return null;
        }

        const collectionName = this.currentCollection.name;
        for (const prop of Object.values(this.currentCollection.props)) {
            // setup already loaded props
            this.debugProps[prop.object.id] = {
                collection: prop.collection,
                collision: !prop.object.noCollision,
                id: prop.object.id,
                matrix: prop.object.matrix,
                entity: prop.loaded
                    ? await this.getCollectionLoadedEntity(prop.object.id)
                    : await this.spawnDebugProp(prop.object),
                state: prop.loaded ? PropState.loaded : PropState.placed,
                model: prop.model,
                position: prop.object.position,
            };
        }

        this.highlightProvider.unhighlightAllEntities();
        this.highlightProvider.highlightEntities(
            Object.values(this.debugProps)
                .filter(prop => prop.collection == collectionName)
                .map(prop => prop.entity)
        );
    }

    private async getCollectionLoadedEntity(id: string) {
        for (let i = 0; i < 10; i++) {
            const entity = this.objectProvider.getEntityFromId(id);
            if (entity) {
                return entity;
            }
            await wait(10 * i);
        }
    }

    @OnNuiEvent(NuiEvent.SelectPlacementCollection)
    public async onSelectCollection({ collectionName }: { collectionName: string }): Promise<PropCollection> {
        const collectionToOpen = await emitRpc<PropCollection>(RpcServerEvent.PROP_GET_PROP_COLLECTION, collectionName);
        const playerData = this.playerService.getPlayer();
        if (!['admin', 'staff'].includes(playerData.role)) {
            const [firstProp] = Object.values(collectionToOpen.props);
            if (
                firstProp &&
                getDistance(firstProp.object.position, GetEntityCoords(PlayerPedId()) as Vector3) > 100.0
            ) {
                this.notifier.notify('Tu es trop loin de la collection', 'error');
                return null;
            }
        }

        this.currentCollection = collectionToOpen;
        await this.loadCurrentCollection();

        return this.currentCollection;
    }

    @OnNuiEvent(NuiEvent.SelectPropToCreate)
    public async onSelectPropToCreate({ selectedProp }: { selectedProp: PlacementProp }): Promise<void> {
        if (!selectedProp) {
            return;
        }

        await this.spawnNewDebug(selectedProp);
    }

    @OnNuiEvent(NuiEvent.SelectPlacedProp)
    public async onSelectPlacedProp({ id }: { id: string }): Promise<void> {
        const prop = this.debugProps[id];
        if (!prop) {
            return;
        }
        this.highlightProvider.unhighlightAllEntities();
        this.highlightProvider.highlightEntities([prop.entity]);
    }

    private async spawnNewDebug(propToCreate: PlacementProp) {
        const ped = PlayerPedId();
        const coords = GetOffsetFromEntityInWorldCoords(ped, 0, 2.0, 0);
        const id = 'hammer_' + uuidv4();
        this.debugProps[id] = {
            id: id,
            model: propToCreate.model,
            collection: this.currentCollection.name,
            position: [coords[0], coords[1], coords[2], 0],
            matrix: null,
            collision: true,
            entity: await this.spawnDebugProp({
                id: id,
                model: GetHashKey(propToCreate.model),
                position: [coords[0], coords[1], coords[2], 0],
                noCollision: false,
                placeOnGround: true,
            }),
            state: PropState.unplaced,
        };

        await wait(1);
        this.refreshPositionFromGame(this.debugProps[id]);

        if (this.debugProp) {
            this.despawnDebugProp(this.debugProp.id);
        }
        this.debugProp = this.debugProps[id];
    }

    private refreshPositionFromGame(prop: DebugProp) {
        const coords = GetEntityCoords(prop.entity);
        const heading = GetEntityHeading(prop.entity);
        prop.position = [coords[0], coords[1], coords[2], heading];
        prop.matrix = this.makeEntityMatrix(prop.entity);
    }

    @OnNuiEvent(NuiEvent.ChoosePropToCreate)
    public async onChoosePropToCreate({ selectedProp }: { selectedProp: PlacementProp | null }) {
        let propToCreate: PlacementProp;
        if (!selectedProp) {
            const propModel = await this.inputService.askInput({
                title: 'Modèle du prop',
                defaultValue: '',
            });
            if (!propModel || !IsModelValid(propModel)) {
                this.notifier.notify('Modèle invalide', 'error');
                return Err(false);
            }
            propToCreate = {
                model: propModel,
                label: GetLabelText(propModel),
            };
        } else {
            propToCreate = selectedProp;
        }

        await this.spawnNewDebug(propToCreate);
        await this.enterEditorMode();
        return Ok(true);
    }

    public async enterEditorMode(enterCursorMode = true) {
        if (enterCursorMode) {
            EnterCursorMode();
        }
        const [x, y, z] = this.debugProp.position;
        this.circularCamera.createCamera([x, y, z]);
        this.isEditorModeOn = true;
        this.nuiDispatch.dispatch('placement_prop', 'EnterEditorMode');
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleGizmo() {
        if (!this.debugProp || !this.isEditorModeOn) {
            return;
        }
        const entity = this.debugProp.entity;
        if (!DoesEntityExist(entity)) {
            return;
        }

        DisableAllControlActions(0);

        const matrixBuffer = this.makeEntityMatrix(entity);
        const changed = DrawGizmo(matrixBuffer as any, `Gismo_editor_${entity}`);
        if (changed) {
            if (this.debugProp.collision === false) {
                this.objectProvider.applyEntityMatrix(entity, matrixBuffer);
            } else {
                this.applyEntityNormalizedMatrix(entity, matrixBuffer);
            }
        }

        if (IsDisabledControlJustReleased(0, 24)) {
            if (this.snapMode) {
                PlaceObjectOnGroundProperly(entity);
            }
            const entityPos = GetEntityCoords(entity, false) as Vector3;
            const pedPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
            const distance = getDistance(pedPosition, entityPos);
            if (distance > PROP_MAX_DISTANCE) {
                this.notifier.notify('Vous ne pouvez pas déplacer ce prop plus loin ! Rapprochez vous.', 'error');
                const previousPos = this.previousPosition;
                SetEntityCoordsNoOffset(entity, previousPos[0], previousPos[1], previousPos[2], false, false, false);
                return;
            }
            this.previousPosition = entityPos;
            this.circularCamera.updateTarget(entityPos);
        }

        // To allow camera rotation, Cursor mode is disabled when right click is pressed
        if (IsDisabledControlJustPressed(0, 25)) {
            LeaveCursorMode();
        }
        if (IsDisabledControlJustReleased(0, 25)) {
            EnterCursorMode();
        }
    }

    @OnNuiEvent(NuiEvent.LeaveEditorMode)
    public async onLeaveEditorMode() {
        if (this.debugProp) {
            this.despawnOrResetProp(this.debugProp);
            this.debugProp = null;
        }

        if (this.currentCollection) {
            this.highlightProvider.highlightEntities(
                Object.values(this.currentCollection.props)
                    .filter(prop => this.debugProps[prop.object.id])
                    .map(prop => this.debugProps[prop.object.id].entity)
            );
        }

        if (this.isEditorModeOn) {
            this.circularCamera.deleteCamera();

            EnableAllControlActions(0);
            LeaveCursorMode();
            this.isEditorModeOn = false;
            this.isMouseSelectionOn = false;
            this.isPipetteOn = false;
        }
    }

    @OnNuiEvent(NuiEvent.PropPlacementReset)
    public async resetPlacement({
        position,
        rotation,
        scale,
        snap,
    }: {
        position?: boolean;
        rotation?: boolean;
        scale?: boolean;
        snap?: boolean;
    }) {
        if (!this.isEditorModeOn || !this.debugProp || !DoesEntityExist(this.debugProp.entity)) {
            return;
        }
        if (position) {
            const playerPed = PlayerPedId();
            if (!playerPed) {
                return;
            }
            const debugPropOrigin = this.debugProp.position;
            SetEntityCoordsNoOffset(
                this.debugProp.entity,
                debugPropOrigin[0],
                debugPropOrigin[1],
                debugPropOrigin[2],
                false,
                false,
                false
            );
        }
        if (rotation) {
            SetEntityRotation(this.debugProp.entity, 0, 0, 0, 0, false);
        }
        if (snap != null) {
            this.snapMode = snap;
            if (this.snapMode && this.debugProp) {
                PlaceObjectOnGroundProperly_2(this.debugProp.entity);
            }
        }
        if (scale) {
            const rot = GetEntityRotation(this.debugProp.entity);
            SetEntityRotation(this.debugProp.entity, rot[0], rot[1], rot[2], 0, false);
        }
    }

    @OnNuiEvent(NuiEvent.ValidatePlacement)
    public async validatePlacement() {
        if (!this.debugProp || !DoesEntityExist(this.debugProp.entity)) {
            return Err(false);
        }

        if (this.debugProp.state === PropState.unplaced) {
            return await this.validateCreateProp();
        } else {
            return await this.validateEditProp();
        }
    }

    @OnNuiEvent(NuiEvent.RequestDeleteCurrentProp)
    public async requestDeleteCurrentProp() {
        if (!this.debugProp) {
            return Err(false);
        }
        if (!this.debugProp.id) {
            return Ok(true);
        }
        await this.requestDeleteProp({ id: this.debugProp.id });
        await this.onLeaveEditorMode();
        return Ok(true);
    }

    public async validateEditProp() {
        const debugProp = this.debugProp;
        this.refreshPositionFromGame(debugProp);

        const worldObject: WorldObject = {
            id: debugProp.id,
            model: GetHashKey(debugProp.model),
            position: debugProp.position,
            noCollision: !debugProp.collision,
            matrix: debugProp.matrix,
        };

        this.highlightProvider.unhighlightAllEntities();

        // Request edit for other clients.
        TriggerServerEvent(ServerEvent.PROP_REQUEST_EDIT_PROP, worldObject, debugProp.state == PropState.loaded);

        // Fetch prop. Undefined if the prop is not loaded.
        this.currentCollection.props[debugProp.id] = {
            collection: debugProp.collection,
            loaded: debugProp.state == PropState.loaded,
            model: debugProp.model,
            object: worldObject,
        };

        this.highlightProvider.highlightEntities([debugProp.entity]);
        this.debugProp = null;
        await this.onLeaveEditorMode();

        return Ok(true);
    }

    public async validateCreateProp() {
        const debugProp = this.debugProp;
        this.refreshPositionFromGame(debugProp);

        const prop = await emitRpc<WorldPlacedProp>(RpcServerEvent.PROP_REQUEST_CREATE_PROP, debugProp);

        if (!prop) {
            return Err(false);
        }

        debugProp.state = PropState.placed;
        this.currentCollection.props[prop.object.id] = prop;
        this.currentCollection.size += 1;
        this.debugProp = null;

        // We also need to update the client and server data on the nui
        const collections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_GET_COLLECTIONS_DATA);
        await this.refreshPropPlacementMenuData(collections, this.currentCollection);
        await this.onLeaveEditorMode();
        this.highlightProvider.highlightEntities([debugProp.entity]);

        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.RequestDeleteProp)
    public async requestDeleteProp({ id }: { id: string }) {
        if (!this.currentCollection) {
            return Err(false);
        }

        this.despawnDebugProp(id);
        const prop = this.currentCollection.props[id];

        if (prop) {
            this.currentCollection.size -= 1;
            if (prop.loaded) {
                this.currentCollection.loaded_size -= 1;
            }
            delete this.currentCollection.props[id];
            TriggerServerEvent(ServerEvent.PROP_REQUEST_DELETE_PROP, this.currentCollection.name, id);
            await this.refreshPropPlacementMenuData(null, this.currentCollection);
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.ChoosePlacedPropToEdit)
    public async choosePlacedPropToEdit({ id }: { id: string }) {
        if (!this.debugProps[id]) {
            return Err(false);
        }
        this.debugProp = this.debugProps[id];
        await this.enterEditorMode();
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.ToggleMouseSelection)
    public async toggleMouseSelection({ value }: { value: boolean }) {
        this.isMouseSelectionOn = value;
        if (value) {
            EnterCursorMode();
        } else {
            LeaveCursorMode();
        }
    }

    @OnNuiEvent(NuiEvent.TogglePipette)
    public async togglePipette({ value }: { value: boolean }) {
        this.isPipetteOn = value;
        if (value) {
            EnterCursorMode();
        } else {
            LeaveCursorMode();
        }
    }

    @OnNuiEvent(NuiEvent.PropToggleCollision)
    public async toggleCollision({ value }: { value: boolean }) {
        if (!this.debugProp) {
            return;
        }
        this.debugProp.collision = value;
        await this.resetPlacement({ rotation: true, scale: true });
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleMouseSelection() {
        if (!this.isMouseSelectionOn && !this.isPipetteOn) {
            return;
        }
        DisableAllControlActions(0);
        const hitEntDebug = SelectEntityAtCursor(6 | (1 << 5), true);
        const obj = Object.values(this.debugProps).find(prop => prop.entity === hitEntDebug);
        if (!obj) {
            this.highlightProvider.unhighlightAllEntities();
            return;
        }
        this.highlightProvider.highlightEntities([hitEntDebug]);
        if (IsDisabledControlJustPressed(0, 24)) {
            if (this.isMouseSelectionOn) {
                this.debugProp = obj;
                this.isMouseSelectionOn = false;
                await this.enterEditorMode(false);
                return;
            }
            if (this.isPipetteOn) {
                const selectedProp = {
                    model: obj.model,
                    label: '',
                    collision: true,
                };
                this.isPipetteOn = false;
                LeaveCursorMode();
                await this.onChoosePropToCreate({ selectedProp });
            }
        }
    }

    @OnNuiEvent(NuiEvent.RequestToggleCollectionLoad)
    public async requestToggleCollectionLoad({ name, value }: { name: string; value: boolean }) {
        const { completed } = await this.progressService.progress(
            'prop_toggle_load',
            (value ? 'Chargement' : 'Déchargement') + ' de la collection...',
            5000
        );

        if (!completed) {
            return;
        }

        this.currentCollection = await emitRpc<PropCollection>(
            RpcServerEvent.PROP_REQUEST_TOGGLE_LOAD_COLLECTION,
            name,
            value
        );

        this.highlightProvider.unhighlightAllEntities();
        this.despawnAllDebugProps();

        await this.loadCurrentCollection();

        this.notifier.notify(`Collection ${value ? 'chargée' : 'déchargée'} !`, 'success');

        if (!this.currentCollection) {
            return;
        }

        const collections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_GET_COLLECTIONS_DATA);
        await this.refreshPropPlacementMenuData(collections, this.currentCollection);
    }

    @OnNuiEvent(NuiEvent.SearchProp)
    public async searchProp() {
        const search = await this.inputService.askInput({ title: 'Recherche de prop', defaultValue: '' });
        if (!search) {
            return;
        }
        this.nuiDispatch.dispatch('placement_prop', 'SetCurrentSearch', search);
    }

    @Exportable('IsEditorModeActive')
    public IsEditorModeActive(): boolean {
        return this.isEditorModeOn;
    }

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

    public makeEntityMatrix(entity: number): Float32Array {
        const [f, r, u, a] = GetEntityMatrix(entity);

        return new Float32Array([r[0], r[1], r[2], 0, f[0], f[1], f[2], 0, u[0], u[1], u[2], 0, a[0], a[1], a[2], 1]);
    }

    // Debug Prop Managment
    public async spawnDebugProp(prop: WorldObject): Promise<number> {
        await this.resourceLoader.loadModel(prop.model);
        const entity = CreateObjectNoOffset(
            prop.model,
            prop.position[0],
            prop.position[1],
            prop.position[2],
            false,
            false,
            false
        );

        SetEntityHeading(entity, prop.position[3]);

        if (prop.matrix) {
            this.objectProvider.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityAlpha(entity, 200, false);
        SetEntityCollision(entity, false, false);
        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true); // Always freeze for the moment
        if (prop.placeOnGround) {
            PlaceObjectOnGroundProperly(entity);
        }

        return entity;
    }

    public despawnDebugProp(id: string): Promise<void> {
        const prop = this.debugProps[id];
        if (!prop) {
            return;
        }

        if (prop.state != PropState.loaded) {
            if (DoesEntityExist(prop.entity)) {
                if (GetEntityModel(prop.entity) == GetHashKey(prop.model)) {
                    DeleteEntity(prop.entity);
                } else {
                    console.trace('Attemp to delete an debug entity of wrong model', GetEntityModel(prop.entity));
                }
            } else {
                console.trace('Attemp to delete an non existing debug entity');
            }
        }

        delete this.debugProps[prop.id];
    }

    public async resetProp(prop: DebugProp): Promise<void> {
        const entity = prop.entity;
        if (!DoesEntityExist(entity)) {
            return;
        }
        SetEntityCoordsNoOffset(entity, prop.position[0], prop.position[1], prop.position[2], false, false, false);
        SetEntityHeading(entity, prop.position[3]);

        if (prop.matrix) {
            this.objectProvider.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true);
    }

    public despawnOrResetProp(prop: DebugProp) {
        if (prop.state === PropState.unplaced) {
            this.despawnDebugProp(prop.id);
        } else {
            this.resetProp(prop);
        }
    }

    public despawnAllDebugProps() {
        for (const object of Object.values(this.debugProps)) {
            this.despawnDebugProp(object.id);
        }
    }

    // Collection management

    public despawnDebugPropsOfCollection(collection: PropCollection) {
        for (const prop of Object.values(this.debugProps)) {
            // Despawn debug props for unload props
            if (prop.collection === collection.name) {
                this.despawnDebugProp(prop.id);
            }
        }
    }
}
