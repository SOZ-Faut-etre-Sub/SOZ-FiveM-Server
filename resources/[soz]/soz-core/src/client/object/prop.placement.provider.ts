import { Command } from '@public/core/decorators/command';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { NuiEvent } from '@public/shared/event';
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
import { Err, isErr, Ok, Result } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { ResourceLoader } from '../resources/resource.loader';
import { PropProvider } from './prop.provider';

type EditorState = {
    debugProp: SpawedWorlPlacedProp | null;
    isEditorModeOn: boolean;
    highlightedProps: Record<string, number>;
    propsToHighlight: Record<string, number>;
    currentCollection: SpawnedCollection | null;
};

@Provider()
export class PropPlacementProvider {
    @Inject(NuiMenu)
    private menu: NuiMenu;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(PropProvider)
    private propProvider: PropProvider;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private editorState: EditorState = null;

    @Command('soz_core_toggle_prop_placement_menu', {
        description: 'Ouvrir le menu placement de prop',
        passthroughNuiFocus: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'F4',
            },
        ],
    })
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
        const collections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_GET_COLLECTIONS_DATA);
        this.editorState = {
            debugProp: null,
            isEditorModeOn: false,
            highlightedProps: {},
            propsToHighlight: {},
            currentCollection: null,
        };
        this.menu.openMenu(MenuType.PropPlacementMenu, {
            props: PLACEMENT_PROP_LIST,
            serverData: serverData,
            clientData: clientData,
            collections: collections,
        });
    }

    @OnNuiEvent(NuiEvent.PropPlacementReturnToMainMenu)
    public async onReturnToMainMenu() {
        console.log('Return to main menu triggered');
        if (this.editorState.currentCollection) {
            await this.propProvider.despawnDebugCollection(this.editorState.currentCollection);
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
        };
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
        if (this.editorState && this.editorState.currentCollection) {
            await this.propProvider.despawnDebugCollection(this.editorState.currentCollection);
            this.editorState.currentCollection = null;
        }
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
        console.log('current collection : ', this.editorState.currentCollection);
        return collection;
    }

    // Not usef for now
    public async handleHighlight(): Promise<void> {
        if (!this.editorState) {
            return;
        }
        if (!this.editorState.propsToHighlight) {
            return;
        }
        for (const unique_id of Object.keys(this.editorState.highlightedProps)) {
            const entity = this.editorState.highlightedProps[unique_id];
            if (!this.editorState.propsToHighlight[unique_id]) {
                SetEntityDrawOutline(entity, false);
                delete this.editorState.highlightedProps[entity];
            }
        }
        for (const unique_id of Object.keys(this.editorState.propsToHighlight)) {
            const entity = this.editorState.propsToHighlight[unique_id];
            if (!this.editorState.highlightedProps[unique_id]) {
                SetEntityDrawOutline(entity, true);
                this.editorState.highlightedProps[unique_id] = entity;
            }
        }
    }

    @OnNuiEvent(NuiEvent.HighlightCollection)
    public async onHighlightCollection({ value }: { value: boolean }): Promise<void> {
        // Not implemented yet
    }

    @OnNuiEvent(NuiEvent.SelectPropToCreate)
    public async onSelectPropToCreate({ selectedProp }: { selectedProp: PlacementProp }): Promise<void> {
        console.log(`prop selected: ${selectedProp}`);
        if (!selectedProp) {
            return;
        }
        const ped = PlayerPedId();
        if (!ped) {
            return;
        }
        if (this.editorState.debugProp) {
            await this.propProvider.despawnDebugProp(this.editorState.debugProp);
            this.editorState.debugProp = null;
        }

        const coords = GetOffsetFromEntityInWorldCoords(ped, 0, 2.0, 0);
        const debugProp: WorldPlacedProp = {
            unique_id: null,
            model: selectedProp.model,
            collection: this.editorState.currentCollection.name,
            position: [coords[0], coords[1], coords[2], 0],
            matrix: null,
            loaded: false,
        };
        const debugPropEntity = await this.propProvider.spawnDebugProp(debugProp, true);
        console.log(`prop spawned: ${debugPropEntity}`);
        this.editorState.debugProp = { ...debugProp, entity: debugPropEntity } as SpawedWorlPlacedProp;
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
        };
        const debugPropEntity = await this.propProvider.spawnDebugProp(debugProp, true);
        this.editorState.debugProp = { ...debugProp, entity: debugPropEntity } as SpawedWorlPlacedProp;
        await this.enterEditorMode();
        return Ok(true);
    }

    public async enterEditorMode() {
        ResetEditorValues();
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

        const matrixBuffer = this.propProvider.makeEntityMatrix(entity);
        const changed = DrawGizmo(matrixBuffer as any, 'Gismo_editor');
        if (changed) {
            this.propProvider.applyEntityMatrix(entity, matrixBuffer);
        }
    }

    @OnNuiEvent(NuiEvent.LeaveEditorMode)
    public async onLeaveEditorMode() {
        if (!this.editorState) {
            return;
        }

        if (this.editorState.debugProp) {
            await this.propProvider.despawnDebugProp(this.editorState.debugProp);

            this.editorState.debugProp = null;
        }

        if (!this.editorState.isEditorModeOn) {
            return;
        }

        EnableAllControlActions(0);
        LeaveCursorMode();
        this.editorState.isEditorModeOn = false;
    }

    @OnNuiEvent(NuiEvent.PropPlacementReset)
    public async resetPlacement({
        position,
        rotation,
        scale,
        snap,
    }: {
        position: boolean;
        rotation: boolean;
        scale: boolean;
        snap: boolean;
    }) {
        if (
            !this.editorState ||
            !this.editorState.isEditorModeOn ||
            !this.editorState.debugProp ||
            !DoesEntityExist(this.editorState.debugProp.entity)
        ) {
            return;
        }
        // Scale is not easy to handle, so just reset the prop completely.
        if (scale) {
            await this.propProvider.despawnDebugProp(this.editorState.debugProp);
            const newDebugPropEntity = await this.propProvider.spawnDebugProp(this.editorState.debugProp, true);
            this.editorState.debugProp.entity = newDebugPropEntity;
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
        if (snap) {
            PlaceObjectOnGroundProperly(this.editorState.debugProp.entity);
        }
    }

    @OnNuiEvent(NuiEvent.ValidatePlacement)
    public async validatePlacement() {
        if (
            !this.editorState ||
            !this.editorState.isEditorModeOn ||
            !this.editorState.debugProp ||
            !DoesEntityExist(this.editorState.debugProp.entity)
        ) {
            return Err(false);
        }

        const debugProp = this.editorState.debugProp;
        const coords = GetEntityCoords(debugProp.entity, false);
        const heading = GetEntityHeading(debugProp.entity);
        const matrix = this.propProvider.makeEntityMatrix(debugProp.entity);
        const worldPlacedProp: WorldPlacedProp = {
            unique_id: null,
            model: debugProp.model,
            collection: this.editorState.currentCollection.name,
            position: [coords[0], coords[1], coords[2], heading],
            matrix: matrix,
            loaded: false,
        };

        const newCollection: Result<PropCollection, never> = await emitRpc(
            RpcServerEvent.PROP_REQUEST_CREATE_PROP,
            worldPlacedProp
        );

        if (isErr(newCollection)) {
            return Err(false);
        }

        // I don't think doing this is a good idea. Rather fetch current collection for server
        // then update the provider and nui data. For the entity, we can maybe keep the entity of
        // the debugProp. I have to work this out better.
        this.editorState.currentCollection.props.push({
            ...worldPlacedProp,
            entity: debugProp.entity,
        });
        this.editorState.currentCollection.size += 1;
        this.editorState.debugProp = null;

        // We also need to update the client and server data on the nui
        const collections = await emitRpc<PropCollectionData[]>(RpcServerEvent.PROP_GET_COLLECTIONS_DATA);
        await this.refreshPropPlacementMenuData(collections, newCollection.ok);

        this.notifier.notify('Le prop a bien été créé !', 'success');

        await this.onLeaveEditorMode();

        return Ok(true);
    }

    @Exportable('IsEditorModeActive')
    public IsPlacementModeActive(): boolean {
        return this.editorState && this.editorState.isEditorModeOn;
    }
}
