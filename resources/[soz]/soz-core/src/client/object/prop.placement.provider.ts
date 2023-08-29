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
    SpawedWorlPlacedProp,
    SpawnedCollection,
    WorldPlacedProp,
} from '@public/shared/object';
import { Err, Ok } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
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
};

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
            await this.onLeaveEditorMode();
            await this.onReturnToMainMenu();
            this.editorState = null;
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
        await this.onLeaveEditorMode();
        await this.onReturnToMainMenu();
        this.editorState = null;
    }

    @OnNuiEvent(NuiEvent.PropPlacementReturnToMainMenu)
    public async onReturnToMainMenu() {
        if (this.editorState.currentCollection) {
            await this.propProvider.despawnAllDebugProps();
        }
        if (this.editorState.debugProp) {
            await this.propProvider.despawnDebugProp(this.editorState.debugProp);
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

    @OnNuiEvent(NuiEvent.PropPlacementReturnToCollection)
    public async onReturnToCollection() {
        if (!this.editorState || !this.editorState.currentCollection) {
            return;
        }
        await this.highlightProvider.highlightEntities(
            Object.values(this.editorState.currentCollection.props).map(prop => prop.entity)
        );
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
        await this.propProvider.despawnDebugCollection(this.editorState.currentCollection);
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
        this.editorState.currentCollection = await this.propProvider.spawnDebugCollection(collection);
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

        await this.propProvider.despawnAllDebugProps();

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
        await this.propProvider.spawnDebugCollection(this.editorState.currentCollection);
        const debugPropEntity = await this.propProvider.spawnDebugProp(debugProp, true);
        this.editorState.debugProp = { ...debugProp, entity: debugPropEntity } as SpawedWorlPlacedProp;
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
            unique_id: null,
            model: propToCreate.model,
            collection: null,
            position: [coords[0], coords[1], coords[2], 0],
            matrix: null,
            loaded: false,
            collision: true,
        };
        const debugPropEntity = await this.propProvider.spawnDebugProp(debugProp, true);
        this.editorState.debugProp = { ...debugProp, entity: debugPropEntity } as SpawedWorlPlacedProp;
        await this.enterEditorMode();
        return Ok(true);
    }

    public async enterEditorMode() {
        EnterCursorMode();
        this.editorState.isEditorModeOn = true;
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
            PlaceObjectOnGroundProperly(entity);
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
    }

    @OnNuiEvent(NuiEvent.TogglePedMovements)
    public async onTogglePedMovements({ value }: { value: boolean }) {
        if (!this.editorState || !this.editorState.debugProp) {
            return;
        }
        this.editorState.isEditorModeOn = value;
        if (value) {
            EnterCursorMode();
        } else {
            LeaveCursorMode();
        }
    }

    @OnNuiEvent(NuiEvent.LeaveEditorMode)
    public async onLeaveEditorMode() {
        if (!this.editorState) {
            return;
        }

        if (this.editorState.debugProp) {
            await this.propProvider.despawnAllDebugProps();
        }
        this.editorState.debugProp = null;

        if (this.editorState.currentCollection) {
            await this.propProvider.despawnDebugCollection(this.editorState.currentCollection);
            await this.highlightProvider.highlightEntities(
                Object.values(this.editorState.currentCollection.props).map(prop => prop.entity)
            );
        }

        if (!this.editorState.isEditorModeOn && !this.editorState.isMouseSelectionOn && !this.editorState.isPipetteOn) {
            return;
        }

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
        // If its an prop creation, the debug prop won't have an unique_id yet.
        // If it has one, therefore it is an edit.
        if (!this.editorState || !this.editorState.debugProp || !DoesEntityExist(this.editorState.debugProp.entity)) {
            return Err(false);
        }
        if (this.editorState.debugProp.unique_id) {
            return await this.validateEditProp();
        } else {
            return await this.validateCreateProp();
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

        TriggerServerEvent(ServerEvent.PROP_REQUEST_EDIT_PROP, editedProp);
        this.editorState.currentCollection.props[debugProp.unique_id] = {
            ...editedProp,
            entity: debugProp.entity,
        };
        this.editorState.debugProp = null;
        await this.onLeaveEditorMode();

        return Ok(true);
    }

    public async validateCreateProp() {
        const debugProp = this.editorState.debugProp;
        const coords = GetEntityCoords(debugProp.entity, false);
        const heading = GetEntityHeading(debugProp.entity);
        const matrix = this.propProvider.makeEntityMatrix(debugProp.entity);
        const id = uuidv4();
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

        this.editorState.debugProp = { ...prop };
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
                this.nuiDispatch.dispatch('placement_prop', 'EnterEditorMode');
                this.editorState.isEditorModeOn = true;
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
                this.nuiDispatch.dispatch('placement_prop', 'EnterEditorMode');
            }
        }
    }

    @OnNuiEvent(NuiEvent.RequestToggleCollectionLoad)
    public async requestToggleCollectionLoad({ name, value }: { name: string; value: boolean }) {
        const newCollection = await emitRpc<PropCollection>(
            RpcServerEvent.PROP_REQUEST_TOGGLE_LOAD_COLLECTION,
            name,
            value
        );
        if (!newCollection) {
            this.notifier.notify('Impossible de charger ou décharger la collection.', 'error');
            return;
        }

        await this.highlightProvider.unhighlightAllEntities();

        if (value) {
            await this.propProvider.despawnDebugCollection(this.editorState.currentCollection);

            this.editorState.currentCollection = await this.propProvider.spawnCollection(newCollection);
        } else {
            await this.propProvider.despawnCollection(this.editorState.currentCollection);

            this.editorState.currentCollection = await this.propProvider.spawnDebugCollection(newCollection);
            await this.highlightProvider.highlightEntities(
                Object.values(this.editorState.currentCollection.props).map(prop => prop.entity)
            );
        }

        const collections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_GET_COLLECTIONS_DATA);
        await this.refreshPropPlacementMenuData(collections, newCollection);

        this.notifier.notify(`Collection ${value ? 'chargée' : 'déchargée'} !`, 'success');
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
