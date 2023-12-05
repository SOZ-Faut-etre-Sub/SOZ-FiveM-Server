import { Once, OnceStep, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { uuidv4 } from '@public/core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PLACEMENT_PROP_LIST, PlacementProp } from '@public/shared/nui/prop_placement';
import {
    PropCollection,
    PropCollectionData,
    PropServerData,
    PropState,
    SpawedWorlPlacedProp,
    SpawnedCollection,
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
import { CircularCameraProvider } from './circular.camera.provider';
import { PropHighlightProvider } from './prop.highlight.provider';
import { PropProvider } from './prop.provider';

type EditorState = {
    debugProp: SpawedWorlPlacedProp | null;
    isEditorModeOn: boolean;
    highlightedProps: Record<string, number>;
    propsToHighlight: Record<string, number>;
    currentCollection: SpawnedCollection | null;
    isMouseSelectionOn: boolean;
    isPipetteOn: boolean;
    snapMode?: boolean;
    previousPosition?: Vector3;
};

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

    @Inject(PropProvider)
    private propProvider: PropProvider;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(CircularCameraProvider)
    private circularCamera: CircularCameraProvider;

    @Inject(ProgressService)
    private progressService: ProgressService;

    private editorState: EditorState = null;

    @Once(OnceStep.Start)
    public async onInit() {
        RegisterKeyMapping('+gizmoSelect', 'Gizmo : Sélectionner un axe.', 'MOUSE_BUTTON', 'MOUSE_LEFT');
        RegisterKeyMapping('+gizmoTranslation', 'Gizmo : Mode Translation', 'keyboard', 'T');
        RegisterKeyMapping('+gizmoRotation', 'Gizmo : Mode Rotation', 'keyboard', 'R');
        RegisterKeyMapping('+gizmoScale', 'Giszmo : Mode Scale', 'keyboard', 'S');
        RegisterKeyMapping('+gizmoLocal', 'Gizmo : Coordonnées locales', 'keyboard', 'L');
    }

    @OnEvent(ClientEvent.PROP_OPEN_MENU)
    public async openPlacementMenu() {
        if (this.menu.getOpened() === MenuType.PropPlacementMenu) {
            await this.doCloseEditor();
            this.menu.closeMenu();
            return;
        }
        const serverData = await emitRpc<PropServerData>(RpcServerEvent.PROP_GET_SERVER_DATA);
        const clientData = this.propProvider.getPropClientData();
        let collections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_GET_COLLECTIONS_DATA);
        const playerData = this.playerService.getPlayer();
        if (!['admin', 'staff'].includes(playerData.role)) {
            collections = collections.filter(c => c.creator_citizenID == playerData.citizenid);
        }
        this.editorState = {
            debugProp: null,
            isEditorModeOn: false,
            highlightedProps: {},
            propsToHighlight: {},
            currentCollection: null,
            isMouseSelectionOn: false,
            isPipetteOn: false,
        };
        this.menu.openMenu(MenuType.PropPlacementMenu, {
            props: PLACEMENT_PROP_LIST,
            serverData: serverData,
            clientData: clientData,
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

    @OnEvent(ClientEvent.PROP_ON_GRID_CHANGE)
    public async onGridChange() {
        if (!this.editorState) {
            return;
        }
        this.notifier.notify('Changement de zone, fermeture du menu...', 'warning');
        await this.doCloseEditor();
        this.menu.closeMenu();
    }

    public async doCloseEditor() {
        await this.onLeaveEditorMode();
        await this.onReturnToMainMenu();
        this.editorState = null;
    }

    @OnNuiEvent(NuiEvent.PropPlacementReturnToMainMenu)
    public async onReturnToMainMenu() {
        if (this.editorState.currentCollection) {
            await this.propProvider.despawnDebugPropsOfCollection(this.editorState.currentCollection);
        }
        this.editorState = {
            debugProp: null,
            isEditorModeOn: false,
            highlightedProps: {},
            propsToHighlight: {},
            currentCollection: null,
            isMouseSelectionOn: false,
            isPipetteOn: false,
        };
        await this.highlightProvider.unhighlightAllEntities();
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

        for (const prop of Object.values(this.editorState.currentCollection.props)) {
            prop.loaded = false;
        }
        await this.propProvider.despawnDebugPropsOfCollection(this.editorState.currentCollection);
        this.editorState.currentCollection = null;
        await this.refreshPropPlacementMenuData(newCollections);
    }

    public async refreshPropPlacementMenuData(
        propCollectionDatas?: PropCollectionData[],
        currentCollection?: PropCollection | null
    ) {
        if (propCollectionDatas) {
            const playerData = this.playerService.getPlayer();
            let collections = propCollectionDatas;
            if (!['admin', 'staff'].includes(playerData.role)) {
                collections = propCollectionDatas.filter(c => c.creator_citizenID == playerData.citizenid);
            }
            this.nuiDispatch.dispatch('placement_prop', 'SetCollectionList', collections);
        }
        if (currentCollection) {
            this.nuiDispatch.dispatch('placement_prop', 'SetCollection', currentCollection);
        }
        this.nuiDispatch.dispatch('placement_prop', 'SetDatas', {
            serverData: await emitRpc<PropServerData>(RpcServerEvent.PROP_GET_SERVER_DATA),
            clientData: this.propProvider.getPropClientData(),
        });
    }

    @OnNuiEvent(NuiEvent.SelectPlacementCollection)
    public async onSelectCollection({ collectionName }: { collectionName: string }): Promise<PropCollection> {
        const collection = await emitRpc<PropCollection>(RpcServerEvent.PROP_GET_PROP_COLLECTION, collectionName);
        if (!collection) {
            return null;
        }
        this.editorState.currentCollection = await this.propProvider.fetchCollection(collection);
        await this.highlightProvider.unhighlightAllEntities();
        await this.highlightProvider.highlightEntities(
            Object.values(this.editorState.currentCollection.props).map(prop => prop.entity)
        );
        return collection;
    }

    @OnNuiEvent(NuiEvent.SelectPropToCreate)
    public async onSelectPropToCreate({ selectedProp }: { selectedProp: PlacementProp }): Promise<void> {
        if (!selectedProp) {
            return;
        }
        const ped = PlayerPedId();
        if (!ped) {
            return;
        }
        if (this.editorState.debugProp) {
            await this.propProvider.despawnOrResetProp(this.editorState.debugProp);
            this.editorState.debugProp = null;
        }

        const coords = GetOffsetFromEntityInWorldCoords(ped, 0, 2.0, 0);
        const debugProp: WorldPlacedProp = {
            unique_id: uuidv4(),
            model: selectedProp.model,
            collection: this.editorState.currentCollection.name,
            position: [coords[0], coords[1], coords[2], 0],
            matrix: null,
            loaded: false,
            collision: true,
        };
        const debugPropEntity = await this.propProvider.spawnDebugProp(debugProp, true, PropState.unplaced);
        this.editorState.debugProp = {
            ...debugProp,
            entity: debugPropEntity,
            state: PropState.unplaced,
        } as SpawedWorlPlacedProp;
    }

    @OnNuiEvent(NuiEvent.SelectPlacedProp)
    public async onSelectPlacedProp({ id }: { id: string }): Promise<void> {
        if (!this.editorState || !this.editorState.currentCollection || !this.editorState.currentCollection.props[id]) {
            return;
        }
        const prop = this.editorState.currentCollection.props[id];
        await this.highlightProvider.unhighlightAllEntities();
        await this.highlightProvider.highlightEntities([prop.entity]);
    }

    @OnNuiEvent(NuiEvent.ChoosePropToCreate)
    public async onChoosePropToCreate({ selectedProp }: { selectedProp: PlacementProp | null }) {
        if (this.editorState.debugProp) {
            await this.propProvider.despawnDebugProp(this.editorState.debugProp);
            this.editorState.debugProp = null;
        }
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
            } as PlacementProp;
        } else {
            propToCreate = selectedProp;
        }
        const ped = PlayerPedId();
        if (!ped) {
            return Err(false);
        }
        const coords = GetOffsetFromEntityInWorldCoords(ped, 0, 2.0, 0);
        const debugProp: WorldPlacedProp = {
            unique_id: uuidv4(),
            model: propToCreate.model,
            collection: null,
            position: [coords[0], coords[1], coords[2], 0],
            matrix: null,
            loaded: false,
            collision: true,
        };
        const debugPropEntity = await this.propProvider.spawnDebugProp(debugProp, true, PropState.unplaced);
        this.editorState.debugProp = {
            ...debugProp,
            entity: debugPropEntity,
            state: PropState.unplaced,
        } as SpawedWorlPlacedProp;
        await this.enterEditorMode();
        return Ok(true);
    }

    public async enterEditorMode(enterCursorMode = true) {
        if (enterCursorMode) {
            EnterCursorMode();
        }
        const [x, y, z] = this.editorState.debugProp.position;
        this.circularCamera.createCamera([x, y, z]);
        this.editorState.isEditorModeOn = true;
        this.nuiDispatch.dispatch('placement_prop', 'EnterEditorMode');
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleGizmo() {
        if (!this.editorState || !this.editorState.debugProp || !this.editorState.isEditorModeOn) {
            return;
        }
        const entity = this.editorState.debugProp.entity;
        if (!DoesEntityExist(entity)) {
            return;
        }

        DisableAllControlActions(0);

        if (this.editorState.snapMode) {
            PlaceObjectOnGroundProperly_2(entity);
        }

        const matrixBuffer = this.propProvider.makeEntityMatrix(entity);
        const changed = DrawGizmo(matrixBuffer as any, `Gismo_editor_${entity}`);
        if (changed) {
            if (this.editorState.debugProp.collision === false) {
                this.propProvider.applyEntityMatrix(entity, matrixBuffer);
            } else {
                this.propProvider.applyEntityNormalizedMatrix(entity, matrixBuffer);
            }
        }

        if (IsDisabledControlJustReleased(0, 24)) {
            const entityPos = GetEntityCoords(entity, false) as Vector3;
            const pedPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
            const distance = getDistance(pedPosition, entityPos);
            if (distance > PROP_MAX_DISTANCE) {
                this.notifier.notify('Vous ne pouvez pas déplacer ce prop plus loin ! Rapprochez vous.', 'error');
                const previousPos = this.editorState.previousPosition;
                SetEntityCoordsNoOffset(entity, previousPos[0], previousPos[1], previousPos[2], false, false, false);
                return;
            }
            this.editorState.previousPosition = entityPos;
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
        if (!this.editorState) {
            return;
        }

        if (this.editorState.debugProp) {
            this.propProvider.despawnOrResetProp(this.editorState.debugProp);
        }

        if (this.editorState.currentCollection) {
            await this.highlightProvider.highlightEntities(
                Object.values(this.editorState.currentCollection.props).map(prop => prop.entity)
            );
        }

        this.editorState.debugProp = null;

        if (!this.editorState.isEditorModeOn && !this.editorState.isMouseSelectionOn && !this.editorState.isPipetteOn) {
            return;
        }

        this.circularCamera.deleteCamera();

        EnableAllControlActions(0);
        LeaveCursorMode();
        this.editorState.isEditorModeOn = false;
        this.editorState.isMouseSelectionOn = false;
        this.editorState.isPipetteOn = false;
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
        if (
            !this.editorState ||
            !this.editorState.isEditorModeOn ||
            !this.editorState.debugProp ||
            !DoesEntityExist(this.editorState.debugProp.entity)
        ) {
            return;
        }
        if (position) {
            const playerPed = PlayerPedId();
            if (!playerPed) {
                return;
            }
            const debugPropOrigin = this.editorState.debugProp.position;
            SetEntityCoordsNoOffset(
                this.editorState.debugProp.entity,
                debugPropOrigin[0],
                debugPropOrigin[1],
                debugPropOrigin[2],
                false,
                false,
                false
            );
        }
        if (rotation) {
            SetEntityRotation(this.editorState.debugProp.entity, 0, 0, 0, 0, false);
        }
        if (snap != null) {
            this.editorState.snapMode = snap;
        }
        if (scale) {
            const rot = GetEntityRotation(this.editorState.debugProp.entity);
            SetEntityRotation(this.editorState.debugProp.entity, rot[0], rot[1], rot[2], 0, false);
        }
    }

    @OnNuiEvent(NuiEvent.ValidatePlacement)
    public async validatePlacement() {
        if (!this.editorState || !this.editorState.debugProp || !DoesEntityExist(this.editorState.debugProp.entity)) {
            return Err(false);
        }

        if (this.editorState.debugProp.state === PropState.unplaced) {
            return await this.validateCreateProp();
        } else {
            return await this.validateEditProp();
        }
    }

    public async validateEditProp() {
        const debugProp = this.editorState.debugProp;
        const coords = GetEntityCoords(debugProp.entity, false);
        const heading = GetEntityHeading(debugProp.entity);
        const matrix = this.propProvider.makeEntityMatrix(debugProp.entity);
        const editedProp: WorldPlacedProp = {
            ...debugProp,
            position: [coords[0], coords[1], coords[2], heading],
            matrix: matrix,
        };

        await this.highlightProvider.unhighlightAllEntities();

        // Request edit for other clients.
        TriggerServerEvent(ServerEvent.PROP_REQUEST_EDIT_PROP, editedProp, true);

        // Edit position for my client if the prop is loaded.
        if (debugProp.loaded) {
            await this.propProvider.editClientSideProp(debugProp, editedProp);
        }

        // Fetch prop. Undefined if the prop is not loaded.
        const newProp = this.propProvider.getProp(debugProp.unique_id);
        const newEntity = newProp ? newProp.entity : debugProp.entity;

        this.editorState.currentCollection.props[debugProp.unique_id] = {
            ...editedProp,
            entity: newEntity,
            state: debugProp.loaded ? PropState.loaded : PropState.placed,
        };

        this.highlightProvider.highlightEntities([newEntity]);
        this.editorState.debugProp = null;
        await this.onLeaveEditorMode();

        return Ok(true);
    }

    public async validateCreateProp() {
        const debugProp = this.editorState.debugProp;
        const coords = GetEntityCoords(debugProp.entity, false);
        const heading = GetEntityHeading(debugProp.entity);
        const matrix = this.propProvider.makeEntityMatrix(debugProp.entity);
        const id = debugProp.unique_id;
        const worldPlacedProp: WorldPlacedProp = {
            unique_id: id,
            model: debugProp.model,
            collection: this.editorState.currentCollection.name,
            position: [coords[0], coords[1], coords[2], heading],
            matrix: matrix,
            loaded: false,
            collision: debugProp.collision,
        };

        const newCollection = await emitRpc<PropCollection>(RpcServerEvent.PROP_REQUEST_CREATE_PROP, worldPlacedProp);

        if (!newCollection) {
            return Err(false);
        }

        this.editorState.currentCollection.props[id] = {
            ...worldPlacedProp,
            entity: debugProp.entity,
            state: PropState.placed,
        };
        this.editorState.currentCollection.size += 1;
        this.editorState.debugProp = null;

        // We also need to update the client and server data on the nui
        const collections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_GET_COLLECTIONS_DATA);
        await this.refreshPropPlacementMenuData(collections, newCollection);
        await this.onLeaveEditorMode();
        await this.highlightProvider.highlightEntities([debugProp.entity]);

        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.RequestDeleteProp)
    public async requestDeleteProp({ id }: { id: string }) {
        if (!this.editorState || !this.editorState.currentCollection || !this.editorState.currentCollection.props[id]) {
            return Err(false);
        }
        const prop = this.editorState.currentCollection.props[id];
        await this.propProvider.despawnDebugProp(prop);
        this.editorState.currentCollection.size -= 1;
        if (prop.loaded) {
            this.editorState.currentCollection.loaded_size -= 1;
        }
        delete this.editorState.currentCollection.props[id];
        TriggerServerEvent(ServerEvent.PROP_REQUEST_DELETE_PROPS, [id]);
        await this.refreshPropPlacementMenuData(null, this.editorState.currentCollection);
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.RequestDeleteCurrentProp)
    public async requestDeleteCurrentProp() {
        if (!this.editorState || !this.editorState.debugProp) {
            return Err(false);
        }
        if (!this.editorState.debugProp.unique_id) {
            return Ok(true);
        }
        if (
            !this.editorState.currentCollection ||
            !this.editorState.currentCollection.props[this.editorState.debugProp.unique_id]
        ) {
            return Err(false);
        }
        await this.requestDeleteProp({ id: this.editorState.debugProp.unique_id });
        await this.onLeaveEditorMode();
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.ChoosePlacedPropToEdit)
    public async choosePlacedPropToEdit({ id }: { id: string }) {
        if (!this.editorState || !this.editorState.currentCollection || !this.editorState.currentCollection.props[id]) {
            return Err(false);
        }
        const prop = this.editorState.currentCollection.props[id];

        this.editorState.debugProp = {
            ...prop,
            state: prop.loaded ? PropState.loaded : PropState.placed,
        };
        await this.enterEditorMode();
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.ToggleMouseSelection)
    public async toggleMouseSelection({ value }: { value: boolean }) {
        if (!this.editorState) {
            return;
        }
        this.editorState.isMouseSelectionOn = value;
        if (value) {
            EnterCursorMode();
        } else {
            LeaveCursorMode();
        }
    }

    @OnNuiEvent(NuiEvent.TogglePipette)
    public async togglePipette({ value }: { value: boolean }) {
        if (!this.editorState) {
            return;
        }
        this.editorState.isPipetteOn = value;
        if (value) {
            EnterCursorMode();
        } else {
            LeaveCursorMode();
        }
    }

    @OnNuiEvent(NuiEvent.PropToggleCollision)
    public async toggleCollision({ value }: { value: boolean }) {
        if (!this.editorState || !this.editorState.debugProp) {
            return;
        }
        this.editorState.debugProp.collision = value;
        await this.resetPlacement({ rotation: true, scale: true });
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleMouseSelection() {
        if (!this.editorState || (!this.editorState.isMouseSelectionOn && !this.editorState.isPipetteOn)) {
            return;
        }
        DisableAllControlActions(0);
        const hitEntDebug = SelectEntityAtCursor(6 | (1 << 5), true);
        const obj = Object.values(this.editorState.currentCollection.props).find(prop => prop.entity === hitEntDebug);
        if (!obj) {
            this.highlightProvider.unhighlightAllEntities();
            return;
        }
        this.highlightProvider.highlightEntities([obj.entity]);
        if (IsDisabledControlJustPressed(0, 24)) {
            if (this.editorState.isMouseSelectionOn) {
                this.editorState.debugProp = { ...obj };
                this.editorState.isMouseSelectionOn = false;
                await this.enterEditorMode(false);
                return;
            }
            if (this.editorState.isPipetteOn) {
                const selectedProp = {
                    model: obj.model,
                    label: '',
                    collision: true,
                };
                this.editorState.isPipetteOn = false;
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

        const newCollection = await emitRpc<PropCollection>(
            RpcServerEvent.PROP_REQUEST_TOGGLE_LOAD_COLLECTION,
            name,
            value,
            true
        );
        if (!newCollection) {
            this.notifier.notify('Impossible de charger ou décharger la collection.', 'error');
            return;
        }

        await this.highlightProvider.unhighlightAllEntities();
        await this.propProvider.despawnAllDebugProps();

        if (value) {
            await this.propProvider.createClientSideProp(Object.values(newCollection.props));
        } else {
            await this.propProvider.deleteClientSideProp(Object.values(newCollection.props));
        }

        this.notifier.notify(`Collection ${value ? 'chargée' : 'déchargée'} !`, 'success');

        if (!this.editorState || !this.editorState.currentCollection) {
            return;
        }

        this.editorState.currentCollection = await this.propProvider.fetchCollection(newCollection);

        await this.highlightProvider.highlightEntities(
            Object.values(this.editorState.currentCollection.props).map(prop => prop.entity)
        );

        const collections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_GET_COLLECTIONS_DATA);
        await this.refreshPropPlacementMenuData(collections, newCollection);
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
        return this.editorState && this.editorState.isEditorModeOn;
    }
}
