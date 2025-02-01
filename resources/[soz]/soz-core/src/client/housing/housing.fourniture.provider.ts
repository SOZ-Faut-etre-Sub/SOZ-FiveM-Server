import { Command } from '@core/decorators/command';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Exportable } from '@core/decorators/exports';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { RepositoryUpdate } from '@core/decorators/repository';
import { Tick, TickInterval } from '@core/decorators/tick';
import { emitRpc } from '@core/rpc';
import { uuidv4, wait, waitUntil } from '@core/utils';
import { AnimationService } from '@public/client//animation/animation.service';
import { AdminSpectateProvider } from '@public/client/admin/admin.spectate.provider';
import { BankService } from '@public/client/bank/bank.service';
import { FlyingCameraProvider } from '@public/client/camera/flying.camera.provider';
import { HousingApartmentZoneProvider } from '@public/client/housing/housing.apartment.zone.provider';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { Notifier } from '@public/client/notifier';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { ObjectService } from '@public/client/object/object.service';
import { PropHighlightService } from '@public/client/object/prop.highlight.service';
import { PlayerService } from '@public/client/player/player.service';
import { HousingRepository } from '@public/client/repository/housing.repository';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { TargetFactory } from '@public/client/target/target.factory';
import { NoClipProvider } from '@public/client/utils/noclip.provider';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import {
    Apartment,
    canUseHousingInAppartment,
    getMaxFourntiure,
    isApartmentExcludeFromHousing,
    isPlayerInsideApartment,
    Property,
} from '@public/shared/housing/housing';
import { MenuType } from '@public/shared/nui/menu';
import { HousingPlacementProp, HousingProp } from '@public/shared/nui/prop_placement';
import { HousingDebugProp, WorldObject } from '@public/shared/object';
import { isStaff, PlayerData } from '@public/shared/player';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { RepositoryType } from '@public/shared/repository';
import { Err, Ok } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

import { InventoryType } from '../../shared/inventory';
import { ScreenService } from '../screen.service';
import { HousingPropertyZoneProvider } from './housing.property.zone.provider';

@Provider()
export class HousingFournitureProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private menu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PropHighlightService)
    private propHighlightService: PropHighlightService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(ObjectService)
    private objectService: ObjectService;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(ScreenService)
    private screenService: ScreenService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(FlyingCameraProvider)
    private flyingCameraProvider: FlyingCameraProvider;

    @Inject(HousingApartmentZoneProvider)
    private housingApartmentZoneProvider: HousingApartmentZoneProvider;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(NoClipProvider)
    private noClipProvider: NoClipProvider;

    @Inject(AdminSpectateProvider)
    private adminSpectateProvider: AdminSpectateProvider;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(HousingPropertyZoneProvider)
    private housingPropertyZoneProvider: HousingPropertyZoneProvider;

    private camera: number;

    private debugProp: HousingDebugProp | null;
    private debugProps: HousingDebugProp[] = [];
    private isEditorModeOn: boolean = false;
    private previousPosition?: Vector3;

    private lastApartment: Apartment;
    private lastInterior: number;
    private lights: Record<number, boolean> = {};
    private shellNeedUpdate = true;
    private maxFourntiures = 0;
    private apartmentFourntiures: Record<
        number,
        {
            placementProps: Record<number, HousingPlacementProp>;
            updated: number | null;
        }
    > = {};
    private taregetedFourniture: HousingProp;
    private highlightDisabled = false;

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoriesLoaded() {
        const player = this.playerService.getPlayer();

        if (!isPlayerInsideApartment(player)) {
            return;
        }

        await this.houseEnter(player.metadata.inside.apartment, player.metadata.inside.property);
    }

    @OnEvent(ClientEvent.HOUSING_TELEPORT)
    public async houseEnter(apartmentId: number | false, propertyId: number | false) {
        if (this.lastApartment && this.lastApartment.id !== apartmentId) {
            for (const placementProp of Object.values(
                this.apartmentFourntiures[this.lastApartment.id].placementProps
            )) {
                await this.despawnFourntiure(placementProp, placementProp.fourniture);
            }

            this.lastApartment = null;
            this.lastInterior = null;
            this.lights = {};
            this.shellNeedUpdate = true;
            this.maxFourntiures = 0;
        }

        if (!apartmentId || !propertyId) {
            return;
        }

        const apartment = this.housingRepository.findApartment(propertyId, apartmentId);
        if (!apartment) {
            return;
        }

        if (isApartmentExcludeFromHousing(apartment)) {
            return;
        }
        this.lastApartment = apartment;

        const ped = PlayerPedId();
        await waitUntil(async () => !IsEntityPositionFrozen(ped) || this.noClipProvider.IsNoClipMode());

        this.lastInterior = this.getInteriorFromCollision([
            this.lastApartment.position[0],
            this.lastApartment.position[1],
            this.lastApartment.position[2],
        ]);

        if (this.shellNeedUpdate) {
            await this.setInteriorShell(propertyId, apartment);

            if (!apartment.shell) {
                const { lights } = await emitRpc<{
                    lights: Record<number, boolean>;
                }>(RpcServerEvent.HOUSING_GET_LIGHTS, apartmentId);
                this.lights = lights;
            } else {
                this.lights = {};
            }

            await this.refreshFournitures(apartment);
        }

        this.apartmentFourntiures[apartment.id] ??= {
            placementProps: {},
            updated: null,
        };

        if (!apartment.shell) {
            const { fournitures, newDate } = await emitRpc<{ fournitures: HousingProp[]; newDate: number }>(
                RpcServerEvent.HOUSING_GET_FOURNITURE,
                apartmentId,
                propertyId,
                this.apartmentFourntiures[apartment.id].updated
            );

            if (fournitures.length) {
                this.apartmentFourntiures[apartment.id].updated = newDate;

                for (const fourniture of fournitures) {
                    if (fourniture.position) {
                        if (!this.apartmentFourntiures[apartment.id].placementProps[fourniture.id]?.entity) {
                            await this.spawnNewFourniture(apartment, fourniture);
                        } else {
                            await this.editFourniture(apartment, fourniture);
                        }
                    } else {
                        if (this.apartmentFourntiures[apartment.id].placementProps[fourniture.id]) {
                            await this.despawnFourntiure(
                                this.apartmentFourntiures[apartment.id].placementProps[fourniture.id],
                                fourniture
                            );
                        } else {
                            this.apartmentFourntiures[apartment.id].placementProps[fourniture.id] = {
                                entity: null,
                                fourniture: fourniture,
                                targetLabel: null,
                                roomId: null,
                            };
                        }
                    }
                }
            }
        } else {
            for (const placementProp of Object.values(this.apartmentFourntiures[apartment.id].placementProps)) {
                await this.despawnFourntiure(placementProp, placementProp.fourniture);
            }
        }
        this.maxFourntiures = getMaxFourntiure(apartment);
    }

    @Tick(TickInterval.EVERY_SECOND * 5)
    public async noClipLookFourntiure() {
        if (!this.noClipProvider.IsNoClipMode()) {
            return;
        }

        const ped = this.adminSpectateProvider.ped || PlayerPedId();
        const apartment = await this.housingRepository.findApartmentFromCollision(ped);

        if (!apartment) {
            if (this.lastApartment) {
                await this.houseEnter(false, false);
            }
            return;
        }

        if (!this.lastApartment || this.lastApartment.id !== apartment.id) {
            await this.houseEnter(apartment.id, apartment.propertyId);
        }
    }

    private async spawnNewFourniture(apartment: Apartment, fourniture: HousingProp) {
        const entity = await this.objectService.createObject({
            model: GetHashKey(fourniture.model),
            position: fourniture.position,
            matrix: fourniture.matrix,
            id: `housing_placed_${fourniture.id}`,
        });

        SetEntityLodDist(entity, 40);
        const targetLabel = this.addTargetZone(entity, fourniture, apartment);

        const roomHash = GetRoomKeyFromEntity(entity);
        const roomId = GetInteriorRoomIndexByHash(this.lastInterior, roomHash);
        this.apartmentFourntiures[apartment.id].placementProps[fourniture.id] = {
            entity: entity,
            fourniture: fourniture,
            targetLabel: targetLabel,
            roomId: roomId,
        };

        this.setLightOnProp(null, this.apartmentFourntiures[apartment.id].placementProps[fourniture.id]);
    }

    private async editFourniture(apartment: Apartment, fourniture: HousingProp) {
        await this.despawnFourntiure(this.apartmentFourntiures[apartment.id].placementProps[fourniture.id], fourniture);
        await this.spawnNewFourniture(apartment, fourniture);
    }

    private async despawnFourntiure(placementProp: HousingPlacementProp, fourniture: HousingProp) {
        const entity = placementProp?.entity;
        if (!entity) {
            return;
        }

        this.removeTargetZone(placementProp);
        this.objectService.deleteObject(entity, {
            model: GetHashKey(fourniture.model),
            position: fourniture.position,
            matrix: fourniture.matrix,
            id: `housing_placed_${fourniture.id}`,
        });
        await wait(0);

        placementProp.entity = null;
        placementProp.fourniture = fourniture;
        placementProp.roomId = null;
    }

    private addTargetZone(entity: number, fourniture: HousingProp, apartment: Apartment): string[] {
        const targetLabel = [];

        if (!fourniture.storageType) {
            return targetLabel;
        }

        if (fourniture.storageType == 'stock') {
            this.targetFactory.createForEntity(entity, [
                {
                    label: 'Coffre de stockage',
                    icon: 'inventory/ouvrir_le_stockage',
                    category: 'citizen',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return (
                            (apartment.senatePartyId !== null || apartment.owner !== null) &&
                            isPlayerInsideApartment(player)
                        );
                    },
                    action: () => {
                        this.inventoryManager.openInventory(
                            InventoryType.HouseStash,
                            `house_stash_${apartment.identifier}`,
                            GetEntityCoords(PlayerPedId()) as Vector3
                        );
                    },
                },
            ]);
            targetLabel.push('Coffre de stockage');
        } else if (fourniture.storageType == 'cash_stock') {
            this.targetFactory.createForEntity(entity, [
                {
                    label: "Coffre d'argent",
                    icon: 'bank/compte_safe',
                    category: 'citizen',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return (
                            (apartment.senatePartyId !== null || apartment.owner !== null) &&
                            isPlayerInsideApartment(player)
                        );
                    },
                    action: () => {
                        this.bankService.openHouseSafe(apartment);
                    },
                },
            ]);
            targetLabel.push("Coffre d'argent");
        } else if (fourniture.storageType == 'food_stock') {
            this.targetFactory.createForEntity(entity, [
                {
                    label: 'Frigo',
                    icon: 'food/carrot',
                    category: 'citizen',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return (
                            (apartment.senatePartyId !== null || apartment.owner !== null) &&
                            isPlayerInsideApartment(player)
                        );
                    },
                    action: () => {
                        this.inventoryManager.openInventory(
                            InventoryType.HouseFridge,
                            `house_fridge_${apartment.identifier}`,
                            GetEntityCoords(PlayerPedId()) as Vector3
                        );
                    },
                },
            ]);
            targetLabel.push('Frigo');
        } else if (fourniture.storageType == 'cloth_stock') {
            this.targetFactory.createForEntity(entity, [
                {
                    label: 'Penderie',
                    icon: 'jobs/habiller',
                    category: 'citizen',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return (
                            (apartment.senatePartyId !== null || apartment.owner !== null) &&
                            isPlayerInsideApartment(player)
                        );
                    },
                    action: () => {
                        this.housingApartmentZoneProvider.openApartmentCloakroom();
                    },
                },
            ]);
            targetLabel.push('Penderie');
        }
        return targetLabel;
    }

    private removeTargetZone(placementProp: HousingPlacementProp) {
        if (placementProp.targetLabel?.length) {
            this.targetFactory.removeForEntity([placementProp.entity]);
        }
        placementProp.targetLabel = null;
    }

    private async setInteriorShell(propretyId: number, apartment: Apartment) {
        const interior = GetInteriorFromCollision(apartment.position[0], apartment.position[1], apartment.position[2]);
        const alreadyEnable = Boolean(IsInteriorEntitySetActive(interior, 'full'));

        if (alreadyEnable !== apartment.shell) {
            if (this.isMenuOpen()) {
                this.menu.closeMenu(false);
            }
            if (apartment.shell) {
                ActivateInteriorEntitySet(interior, 'full');
                this.housingApartmentZoneProvider.createOtherZoneForApartment(propretyId, apartment);
            } else {
                DeactivateInteriorEntitySet(interior, 'full');
                this.housingApartmentZoneProvider.deleteOtherzoneForApartment(apartment);
            }
            RefreshInterior(interior);
        }
        this.shellNeedUpdate = false;
    }

    private async refreshFournitures(apartment: Apartment) {
        if (!apartment.shell) {
            if (!this.apartmentFourntiures[this.lastApartment.id]?.placementProps) {
                return;
            }

            for (const placementProp of Object.values(
                this.apartmentFourntiures[this.lastApartment.id].placementProps
            )) {
                if (placementProp.fourniture.position) {
                    if (!placementProp?.entity) {
                        await this.spawnNewFourniture(apartment, placementProp.fourniture);
                    } else {
                        await this.editFourniture(apartment, placementProp.fourniture);
                    }
                } else {
                    await this.despawnFourntiure(placementProp, placementProp.fourniture);
                }
            }
        }
    }

    @OnEvent(ClientEvent.HOUSING_SYNC_FOURNITURE)
    public async syncFourniture(apartmentId: number) {
        const player = this.playerService.getPlayer();

        if (!player || !isPlayerInsideApartment(player) || player.metadata.inside.apartment !== apartmentId) {
            return;
        }

        await this.houseEnter(apartmentId, player.metadata.inside.property);
        await this.refreshPropPlacementMenuData();
    }

    @OnEvent(ClientEvent.HOUSING_DELETE_FOURNITURE)
    public async deleteFourniture(apartmentId: number, fournitureId: number) {
        if (!this.apartmentFourntiures[apartmentId]) {
            return;
        }

        if (this.isMenuOpen()) {
            this.menu.closeMenu(false);
        }

        const isPlayerInsideTargetedAppartement = this.lastApartment && this.lastApartment.id === apartmentId;
        if (isPlayerInsideTargetedAppartement) {
            const placementProp = this.apartmentFourntiures[apartmentId].placementProps[fournitureId];
            await this.despawnFourntiure(placementProp, placementProp.fourniture);
        }

        delete this.apartmentFourntiures[apartmentId].placementProps[fournitureId];
        await this.syncFourniture(apartmentId);
    }

    public getAllFournitures(): HousingProp[] {
        const allFournitures: HousingProp[] = [];
        for (const placementProp of Object.values(this.apartmentFourntiures[this.lastApartment.id].placementProps)) {
            allFournitures.push(placementProp.fourniture);
        }

        return allFournitures;
    }

    private async resetEditortState() {
        await this.despawnDebugProp();
        this.highlightDisabled = false;
        this.isEditorModeOn = false;
    }

    @RepositoryUpdate(RepositoryType.Housing)
    public async updateShellIfNecessary(property: Property) {
        const player = this.playerService.getPlayer();

        if (!isPlayerInsideApartment(player) || property.id !== player.metadata.inside.property) {
            for (const apartment of property.apartments) {
                if (!apartment.owner && this.apartmentFourntiures[apartment.id]) {
                    await this.clearApartment(apartment);
                }
            }
            return;
        }

        const apartment = property.apartments.find(v => v.id === player.metadata.inside.apartment);
        if (!apartment) {
            for (const apartment of property.apartments) {
                if (!apartment.owner && this.apartmentFourntiures[apartment.id]) {
                    await this.clearApartment(apartment);
                }
            }
            return;
        }

        this.shellNeedUpdate = true;
        if (!apartment.owner) {
            if (this.isMenuOpen()) {
                this.menu.closeMenu(false);
            }

            await this.clearApartment(apartment);
        }

        await this.houseEnter(player.metadata.inside.apartment, player.metadata.inside.property);
    }

    private async clearApartment(apartment: Apartment) {
        for (const placementProp of Object.values(this.apartmentFourntiures[apartment.id].placementProps)) {
            await this.despawnFourntiure(placementProp, placementProp.fourniture);
        }

        delete this.apartmentFourntiures[apartment.id];
    }

    public async openHousingPlacementMenu(player: PlayerData) {
        if (this.isMenuOpen()) {
            this.menu.closeMenu(false);
            return;
        }

        if (!this.lastApartment) {
            return;
        }

        await this.resetEditortState();
        this.camera = this.flyingCameraProvider.createCamera();
        this.flyingCameraProvider.setRestrictionLogic(this.getPositionInInterior.bind(this));

        this.menu.openMenu(MenuType.HousingPropPlacementMenu, {
            fournitures: this.getAllFournitures(),
            max: this.maxFourntiures,
            shellEnable: this.lastApartment.shell,
            isPlayerStaff: isStaff(player),
        });
    }

    public getPositionInInterior(previousPosition: Vector3, newPosition: Vector3): Vector3 {
        if (
            this.lastInterior === this.getInteriorFromCollision([newPosition[0], newPosition[1], newPosition[2] - 0.8])
        ) {
            return newPosition;
        }

        return [
            this.lastInterior !==
            this.getInteriorFromCollision([newPosition[0], previousPosition[1], previousPosition[2]])
                ? previousPosition[0]
                : newPosition[0],
            this.lastInterior !==
            this.getInteriorFromCollision([previousPosition[0], newPosition[1], previousPosition[2]])
                ? previousPosition[1]
                : newPosition[1],
            this.lastInterior !==
            this.getInteriorFromCollision([previousPosition[0], previousPosition[1], newPosition[2] - 0.8])
                ? previousPosition[2]
                : newPosition[2],
        ] as Vector3;
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onCloseMenu({ menuType }) {
        if (menuType !== MenuType.HousingPropPlacementMenu) {
            return;
        }

        this.flyingCameraProvider.deleteCamera();
        await this.doCloseEditor();
    }

    @OnNuiEvent<{ type: string }>(NuiEvent.AdminOpenHousingStorage)
    public async onOpenStorageByType({ type }) {
        const player = this.playerService.getPlayer();
        if (!isStaff(player) || !this.lastApartment) {
            return;
        }

        this.menu.closeMenu(false);

        if (type === 'storage') {
            this.inventoryManager.openInventory(
                InventoryType.HouseStash,
                `house_stash_${this.lastApartment.identifier}`,
                null
            );
        } else if (type === 'safe') {
            this.bankService.openHouseSafe(this.lastApartment);
        } else if (type === 'fridge') {
            this.inventoryManager.openInventory(
                InventoryType.HouseFridge,
                `house_fridge_${this.lastApartment.identifier}`,
                null
            );
        }
    }

    public async doCloseEditor() {
        await this.onLeaveEditorMode();
        await this.resetEditortState();
        this.propHighlightService.unhighlightAllEntities();
    }

    public async refreshPropPlacementMenuData() {
        if (!this.isMenuOpen()) {
            return;
        }

        this.nuiDispatch.dispatch('housing_placement_prop', 'SetFourniture', {
            fournitures: this.getAllFournitures(),
            max: this.maxFourntiures,
            shellEnable: this.lastApartment.shell,
        });
    }

    @OnNuiEvent(NuiEvent.SetHousingShell)
    public async onSetHousingShell({ shellEnable }: { shellEnable: number }): Promise<void> {
        const shell = Boolean(shellEnable);

        if (shell !== this.lastApartment.shell) {
            await emitRpc<boolean>(
                RpcServerEvent.HOUSING_SET_SHELL,
                this.lastApartment.id,
                this.lastApartment.propertyId,
                shell
            );

            this.menu.closeMenu(false);
        }
    }

    @OnNuiEvent(NuiEvent.SelectHousingPropToCreate)
    public async onSelectPropToCreate({ selectedProp }: { selectedProp: HousingProp | null }): Promise<void> {
        if (!selectedProp) {
            this.propHighlightService.unhighlightAllEntities();
            await this.despawnDebugProp();
            return;
        }

        await this.spawnNewDebug(selectedProp);
    }

    @OnNuiEvent(NuiEvent.SelectHousingPlacedProp)
    public async onSelectPlacedProp({ prop }: { prop: HousingProp }): Promise<void> {
        this.propHighlightService.unhighlightAllEntities();
        if (!prop?.position) {
            return;
        }

        const founitureObj = this.apartmentFourntiures[this.lastApartment.id].placementProps[prop.id];
        if (!founitureObj || !founitureObj.entity) {
            return;
        }

        if (!this.highlightDisabled) {
            this.propHighlightService.highlightEntities([founitureObj.entity]);
        }
    }

    private async spawnNewDebug(propToCreate: HousingProp) {
        await this.despawnDebugProp();

        const baseCoords = GetCamCoord(this.camera);
        let coords = propToCreate.position;
        if (!coords) {
            for (let offset = 2.5; offset >= 0; offset -= 0.5) {
                coords = [
                    ...GetObjectOffsetFromCoords(
                        baseCoords[0],
                        baseCoords[1],
                        baseCoords[2] - 0.8,
                        GetCamRot(this.camera, 0)[2],
                        0,
                        offset,
                        0
                    ),
                    0,
                ] as Vector4;

                if (this.lastInterior === this.getInteriorFromCollision([coords[0], coords[1], coords[2]])) {
                    break;
                }
            }
        }

        const id = 'housing_' + uuidv4();
        const newProp = await this.spawnDebugProp({
            id: id,
            model: GetHashKey(propToCreate.model),
            position: coords,
            matrix: propToCreate.matrix ? propToCreate.matrix : null,
            noCollision: false,
        });

        if (!newProp) {
            this.notifier.error('Modèle invalide');
            return;
        }

        this.debugProp = {
            fourniture_id: propToCreate.id,
            model: propToCreate.model,
            position: coords,
            initialPosition: coords,
            matrix: null,
            rotation: null,
            entity: newProp,
            storageType: propToCreate.storageType,
        };

        this.debugProps.push(this.debugProp);
        this.refreshPositionFromGame(this.debugProp);
        this.previousPosition = GetEntityCoords(this.debugProp.entity) as Vector3;
    }

    private refreshPositionFromGame(prop: HousingDebugProp) {
        const coords = GetEntityCoords(prop.entity) as Vector3;
        const rotation = GetEntityRotation(prop.entity, 0) as Vector3;
        const heading = GetEntityHeading(prop.entity);
        prop.position = [coords[0], coords[1], coords[2], heading];
        prop.rotation = rotation;
        prop.matrix = new Float32Array(this.makeEntityMatrix(prop.entity));
    }

    @OnNuiEvent(NuiEvent.ChooseHousingPropToCreate)
    public async onChoosePropToCreate({ selectedProp }: { selectedProp: HousingProp }) {
        if (!selectedProp.label) {
            selectedProp.label = GetLabelText(selectedProp.model);
        }

        await this.spawnNewDebug(selectedProp);
        await this.enterEditorMode();
        return Ok(true);
    }

    public async enterEditorMode() {
        if (!this.debugProp?.entity || !this.debugProps.includes(this.debugProp)) {
            return;
        }

        this.isEditorModeOn = true;
        await this.triggerDispatchTargetFocus({ target: true });

        this.nuiDispatch.dispatch('gizmo', 'setGizmoEntity', {
            debug: this.debugProp,
        });
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleRefreshCamera() {
        if (!this.debugProp || !this.debugProps.includes(this.debugProp) || !this.isEditorModeOn) {
            return;
        }
        const entity = this.debugProp.entity;
        if (!DoesEntityExist(entity)) {
            return;
        }

        this.nuiDispatch.dispatch('gizmo', 'setCameraPosition', {
            position: GetFinalRenderedCamCoord() as Vector3,
            rotation: GetFinalRenderedCamRot(0) as Vector3,
        });
    }

    @OnNuiEvent(NuiEvent.HousingUpdatePosition)
    public async UpdateDebugPositionFromGizmo({ rotation, position }) {
        const entity = this.debugProp.entity;
        if (!DoesEntityExist(entity)) {
            return;
        }

        SetEntityCoordsNoOffset(entity, position[0], position[1], position[2], false, false, false);
        SetEntityRotation(entity, rotation[0], rotation[1], rotation[2], 0, false);

        const entityPos = GetEntityCoords(entity) as Vector3;
        if (this.lastInterior !== GetInteriorFromEntity(entity)) {
            SetEntityCoordsNoOffset(
                entity,
                this.previousPosition[0],
                this.previousPosition[1],
                this.previousPosition[2],
                false,
                false,
                false
            );
            entityPos[0] = this.previousPosition[0];
            entityPos[1] = this.previousPosition[1];
            entityPos[2] = this.previousPosition[2];
        }

        this.refreshPositionFromGame(this.debugProp);
        this.nuiDispatch.dispatch('gizmo', 'SyncDebug', {
            debug: this.debugProp,
        });

        this.previousPosition = entityPos;
    }

    @OnNuiEvent(NuiEvent.LeaveHousingEditorMode)
    public async onLeaveEditorMode() {
        this.nuiDispatch.dispatch('gizmo', 'setGizmoEntity', {
            debug: null,
        });
        await this.despawnDebugProp();

        if (this.isEditorModeOn) {
            this.isEditorModeOn = false;
        }
    }

    @OnNuiEvent(NuiEvent.HousingUpdateDebugStorageType)
    public async updateDebugStorageType(storageType: string) {
        this.debugProp.storageType = storageType;
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.PropPlacementHousingReset)
    public async resetPlacement({ position, rotation }: { position?: boolean; rotation?: boolean }) {
        if (!this.isEditorModeOn || !this.debugProp || !DoesEntityExist(this.debugProp.entity)) {
            return;
        }
        if (position) {
            await this.UpdateDebugPositionFromGizmo({
                position: this.debugProp.initialPosition,
                rotation: this.debugProp.rotation,
            });
        }
        if (rotation) {
            await this.UpdateDebugPositionFromGizmo({
                position: this.debugProp.position,
                rotation: [0, 0, 0],
            });
        }
    }

    @OnNuiEvent(NuiEvent.PropPlacementHousingSnap)
    public async handleSnap() {
        if (!this.isEditorModeOn || !this.debugProp || !DoesEntityExist(this.debugProp.entity)) {
            return;
        }

        const placementProp =
            this.apartmentFourntiures[this.lastApartment.id].placementProps[this.debugProp.fourniture_id];
        if (placementProp?.entity) {
            SetEntityCollision(placementProp.entity, false, false);
        }

        PlaceObjectOnGroundProperly_2(this.debugProp.entity);
        this.refreshPositionFromGame(this.debugProp);
        this.nuiDispatch.dispatch('gizmo', 'SyncDebug', {
            debug: this.debugProp,
        });

        if (placementProp?.entity) {
            SetEntityCollision(placementProp.entity, true, false);
        }
    }

    @OnNuiEvent(NuiEvent.ValidateHousingPlacement)
    public async validatePlacement() {
        if (!this.debugProp || !DoesEntityExist(this.debugProp.entity)) {
            return Err(false);
        }

        const apartment = await this.housingRepository.findApartmentFromCollision(this.debugProp.entity);
        if (!apartment || apartment.id !== this.lastApartment.id) {
            this.notifier.error('Le meuble doit être placé dans le logement!');
            return Err(false);
        }

        return await this.handleCreateOrEditProp();
    }

    public async handleCreateOrEditProp() {
        const debugProp = this.debugProp;
        this.refreshPositionFromGame(debugProp);

        const changed = await emitRpc<boolean>(
            RpcServerEvent.HOUSING_EDIT_FOURNITURE,
            this.lastApartment.id,
            this.lastApartment.propertyId,
            this.debugProp.fourniture_id,
            this.debugProp.position,
            Array.from(this.debugProp.matrix),
            this.debugProp.storageType
        );
        return changed ? Ok(true) : Err(false);
    }

    private getInteriorFromCollision([x, y, z]: Vector3): number {
        return GetInteriorFromCollision(x, y, z);
    }

    @OnNuiEvent(NuiEvent.RequestDeleteHousingCurrentProp)
    public async requestDeleteCurrentProp() {
        if (!this.debugProp || !this.debugProp.fourniture_id || !this.debugProps.includes(this.debugProp)) {
            return Err(false);
        }

        const fourntiure = this.getAllFournitures().find(fourntiure => fourntiure.id === this.debugProp.fourniture_id);

        const changed = await this.requestDeleteProp({ prop: fourntiure });
        return changed ? Ok(true) : Err(false);
    }

    @OnNuiEvent(NuiEvent.RequestHousingDeleteProp)
    public async requestDeleteProp({ prop }: { prop: HousingProp }) {
        await this.despawnDebugProp();

        let changed = true;
        if (prop?.position) {
            changed = await emitRpc<boolean>(
                RpcServerEvent.HOUSING_EDIT_FOURNITURE,
                this.lastApartment.id,
                this.lastApartment.propertyId,
                prop.id,
                null,
                null,
                null
            );
        }
        return changed;
    }

    @OnNuiEvent(NuiEvent.SetHousingHighlightDisabled)
    public async setHighlightDisable(value: boolean) {
        this.highlightDisabled = value;
    }

    @OnNuiEvent(NuiEvent.ChooseHousingPlacedPropToEdit)
    public async choosePlacedPropToEdit({ prop }: { prop: HousingProp }) {
        await this.spawnNewDebug(prop);
        await this.enterEditorMode();
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.ToggleDispatchToggleFocus)
    public async triggerDispatchToggleFocus() {
        this.toggleDispatchTargetFocus(!IsNuiFocused());
    }

    @OnNuiEvent(NuiEvent.ToggleDispatchTargetFocus)
    public async triggerDispatchTargetFocus({ target }) {
        this.toggleDispatchTargetFocus(target);
    }

    private toggleDispatchTargetFocus(target: boolean) {
        const isFocused = IsNuiFocused();
        if (Boolean(isFocused) !== target) {
            this.nuiDispatch.dispatch('menu', 'ToggleFocus');
        }
    }

    @OnNuiEvent(NuiEvent.HousingSelectEntityOnClick)
    public async selectEntityOnMouse() {
        if (
            !IsNuiFocused() ||
            (this.debugProp && this.debugProps.includes(this.debugProp)) ||
            !this.taregetedFourniture ||
            this.isEditorModeOn
        ) {
            return;
        }

        await this.spawnNewDebug(this.taregetedFourniture);
        await this.enterEditorMode();
        this.taregetedFourniture = null;
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleMouseSelection() {
        if (!this.isMenuOpen() || !IsNuiFocused() || this.isEditorModeOn || !this.lastApartment) {
            if (this.taregetedFourniture) {
                this.taregetedFourniture = null;
                this.propHighlightService.unhighlightAllEntities();
            }
            return;
        }

        const hitEntDebug = await this.getEntityFromMouse();
        const fourniture = Object.values(this.apartmentFourntiures[this.lastApartment.id].placementProps).find(
            placementProp => placementProp.entity === hitEntDebug
        )?.fourniture;

        this.propHighlightService.unhighlightAllEntities();
        if (!fourniture) {
            this.taregetedFourniture = null;
            return;
        }

        if (!this.highlightDisabled) {
            this.propHighlightService.highlightEntities([hitEntDebug]);
        }
        this.taregetedFourniture = fourniture;
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

    @Exportable('isHousingEditorModeActive')
    public isHousingEditorModeActive(): boolean {
        return this.isEditorModeOn;
    }

    public makeEntityMatrix(entity: number): number[] {
        const [f, r, u, a] = GetEntityMatrix(entity);

        return [r[0], r[1], r[2], 0, f[0], f[1], f[2], 0, u[0], u[1], u[2], 0, a[0], a[1], a[2], 1];
    }

    public async spawnDebugProp(prop: WorldObject): Promise<number> {
        if (IsModelValid(prop.model)) {
            if (!(await this.resourceLoader.loadModel(prop.model))) {
                return 0;
            }
        } else {
            console.log(`Placement: Model ${prop.model} is not valid for ${prop.id}`);
            return 0;
        }

        const entity = CreateObjectNoOffset(
            prop.model,
            prop.position[0],
            prop.position[1],
            prop.position[2],
            false,
            false,
            false
        );

        this.resourceLoader.unloadModel(prop.model);

        SetEntityHeading(entity, prop.position[3]);

        if (prop.matrix) {
            this.objectService.applyEntityMatrix(entity, prop.matrix);
        }

        SetEntityCollision(entity, false, false);
        SetEntityInvincible(entity, true);
        FreezeEntityPosition(entity, true);

        return entity;
    }

    public async despawnDebugProp(): Promise<void> {
        while (this.debugProps.length !== 0) {
            const prop = this.debugProps.pop();

            const entity = prop.entity;
            const model = prop.model;
            if (prop.entity != 0) {
                if (DoesEntityExist(entity)) {
                    if (GetEntityModel(entity) == GetHashKey(model)) {
                        DeleteEntity(entity);
                    } else {
                        console.trace('Attemp to delete an debug entity of wrong model', GetEntityModel(entity));
                    }
                } else {
                    console.trace('Attemp to delete an non existing debug entity');
                }
            }
        }
    }

    private isMenuOpen = () => {
        return this.menu.getOpened() === MenuType.HousingPropPlacementMenu;
    };

    @Command('housing-menu', {
        description: 'Ouvrir le menu habitation',
        keys: [{ mapper: 'keyboard', key: 'H' }],
    })
    public async openHousingMenu() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (!isStaff(player)) {
            if (!isPlayerInsideApartment(player) || player.metadata.isdead) {
                return;
            }

            const apartement = this.housingRepository.findApartment(
                player.metadata.inside.property,
                player.metadata.inside.apartment as number
            );
            if (!apartement || this.lastApartment?.id !== apartement.id) {
                return;
            }
        } else if (!this.lastApartment) {
            return;
        }

        const interiorFromEntity = GetInteriorFromEntity(PlayerPedId());
        if (
            !canUseHousingInAppartment(player, this.lastApartment, this.housingPropertyZoneProvider.temporaryAccess) ||
            interiorFromEntity === 0 ||
            this.lastInterior !== interiorFromEntity
        ) {
            return;
        }

        await this.openHousingPlacementMenu(player);
    }

    @Command('housing-lights', {
        description: 'Housing: Allumer/éteindre les lumières',
        keys: [{ mapper: 'keyboard', key: 'O' }],
    })
    public async toggleLightsCommand() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (!this.noClipProvider.IsNoClipMode()) {
            if (!isPlayerInsideApartment(player) || player.metadata.isdead) {
                return;
            }

            const apartement = this.housingRepository.findApartment(
                player.metadata.inside.property,
                player.metadata.inside.apartment as number
            );
            if (!apartement || this.lastApartment?.id !== apartement.id) {
                return;
            }

            if (!canUseHousingInAppartment(player, apartement, this.housingPropertyZoneProvider.temporaryAccess)) {
                return;
            }
        } else if (
            !isStaff(player) ||
            !this.lastApartment ||
            !canUseHousingInAppartment(player, this.lastApartment, this.housingPropertyZoneProvider.temporaryAccess)
        ) {
            return;
        }

        const interiorFromEntity = GetInteriorFromEntity(PlayerPedId());
        if (interiorFromEntity === 0 || this.lastInterior !== interiorFromEntity || this.lastApartment.shell) {
            return;
        }

        await this.animationService.playAnimation(
            {
                base: {
                    dictionary: 'anim@mp_player_intmenu@key_fob@',
                    name: 'fob_click',
                    blendInSpeed: 3.0,
                    blendOutSpeed: 3.0,
                    duration: 750,
                    options: {
                        repeat: true,
                        onlyUpperBody: true,
                        enablePlayerControl: true,
                    },
                },
            },
            {
                resetWeapon: false,
            }
        );

        const roomHash = GetRoomKeyFromEntity(PlayerPedId());
        const roomId = GetInteriorRoomIndexByHash(this.lastInterior, roomHash);
        TriggerServerEvent(ServerEvent.HOUSING_TOGGLE_LIGHTS, this.lastApartment.id, roomId);
    }

    @OnEvent(ClientEvent.HOUSING_SYNC_LIGHT)
    public async onSyncLight(apartmentId: number, room: number, lights: boolean) {
        const player = this.playerService.getPlayer();

        if (
            !player ||
            !isPlayerInsideApartment(player) ||
            !this.lastApartment ||
            this.lastApartment.id !== apartmentId ||
            this.lights[room] === lights
        ) {
            return;
        }

        this.lights[room] = lights;
        this.syncLights(room);
    }

    private syncLights(room: number | null) {
        for (const placementProp of Object.values(this.apartmentFourntiures[this.lastApartment.id].placementProps)) {
            this.setLightOnProp(room, placementProp);
        }
    }

    private setLightOnProp(room: number | null, placementProp: HousingPlacementProp) {
        if (placementProp.entity) {
            if (room === null) {
                SetEntityLights(placementProp.entity, !this.lights[placementProp.roomId]);
            } else if (room === placementProp.roomId) {
                SetEntityLights(placementProp.entity, !this.lights[placementProp.roomId]);
            }
        }
    }
}
