import { PlayerInventoryUpdate } from '@public/core/decorators/player';
import { FDO, JobType } from '@public/shared/job';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { RepositoryDelete, RepositoryInsert, RepositoryUpdate } from '../../core/decorators/repository';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import {
    Apartment,
    canPlayerAddRoommate,
    canPlayerAddTenant,
    canPlayerRemoveRoommate,
    canPlayerRemoveTenant,
    canUseHousingInAppartmentNoStaff,
    canUseHousingInProperty,
    hasAccess,
    hasApartmentAccess,
    hasApartmentWithoutAccessInProperty,
    hasAvailableApartment,
    hasOwnedOrAccess,
    hasPlayerOwnedApartment,
    hasPlayerOwnedEmptyApartment,
    hasPlayerOwnedNonEmptyApartment,
    hasPlayerRoommateApartment,
    hasPlayerTenantApartment,
    hasPlayerTenantOrRoommateApartment,
    hasPropertyGarage,
    hasSearchWarrantAccessInApartment,
    isAdminHouse,
    isPlayerInsideApartment,
    Property,
} from '../../shared/housing/housing';
import { MenuType } from '../../shared/nui/menu';
import { isGameMaster } from '../../shared/player';
import { RepositoryType } from '../../shared/repository';
import { RpcServerEvent } from '../../shared/rpc';
import { BlipFactory } from '../blip';
import { InventoryManager } from '../inventory/inventory.manager';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { HousingRepository } from '../repository/housing.repository';
import { TargetFactory } from '../target/target.factory';
import { VehicleGarageProvider } from '../vehicle/vehicle.garage.provider';
import { HousingMenuProvider } from './housing.menu.provider';

const BlipSprite = {
    house: {
        free: 350,
        owned: 40,
    },
    building: {
        free: 476,
        owned: 475,
    },
};

@Provider()
export class HousingPropertyZoneProvider {
    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(VehicleGarageProvider)
    private vehicleGarageProvider: VehicleGarageProvider;

    @Inject(HousingMenuProvider)
    private housingMenuProvider: HousingMenuProvider;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(InputService)
    private inputService: InputService;

    public temporaryAccess = new Set<number>();

    @Exportable('GetPlayerApartmentAccess')
    public getPlayerAccess(): Record<number, Record<number, Apartment>> {
        const access = {};

        const player = this.playerService.getPlayer();

        if (!player) {
            return access;
        }

        for (const property of this.housingRepository.get()) {
            const apartments = {};

            for (const apartment of property.apartments) {
                if (hasApartmentAccess(apartment, player, this.temporaryAccess)) {
                    apartments[apartment.id] = apartment;
                }
            }

            if (Object.keys(apartments).length > 0) {
                access[property.id] = apartments;
            }
        }

        return access;
    }

    @OnEvent(ClientEvent.HOUSING_ADD_TEMPORARY_ACCESS)
    public addTemporaryAccess(apartmentId: number) {
        this.temporaryAccess.add(apartmentId);
    }

    @Once(OnceStep.PlayerLoaded)
    public async syncTemporaryAccess() {
        const ids = await emitRpc<number[]>(RpcServerEvent.HOUSING_GET_TEMPORARY_ACCESS);

        for (const id of ids) {
            this.temporaryAccess.add(id);
        }
    }

    @Once(OnceStep.RepositoriesLoaded)
    public loadZones() {
        const properties = this.housingRepository.get();

        for (const property of properties) {
            this.loadPropertyZone(property);
        }

        this.updateBlips();
    }

    @PlayerInventoryUpdate()
    public updateBlips() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const hasMap = this.inventoryManager.hasEnoughItem('house_map', 1, true);
        const properties = this.housingRepository.get();

        if (properties.length === 0) {
            return;
        }

        for (const property of properties) {
            //meteor
            if (
                [
                    'v_trailer_11',
                    'v_trailer_12',
                    'v_trailer_14',
                    'v_trailer_15',
                    'v_trailer_16',
                    'v_trailer_17',
                    'v_trailer_18',
                    'v_trailer_24',
                    'v_trailer_25',
                ].includes(property.identifier)
            ) {
                continue;
            }

            const id = `property_${property.id}`;
            const hasPropertyAccess = hasOwnedOrAccess(property, player, this.temporaryAccess);
            const hasAvailable = hasAvailableApartment(property);

            if (
                (!hasMap && !hasPropertyAccess) ||
                (!hasAvailable && !hasPropertyAccess) ||
                (isAdminHouse(property) && !isGameMaster(player))
            ) {
                if (this.blipFactory.exist(id)) {
                    this.blipFactory.remove(id);
                }

                continue;
            }

            if (!property.entryZone) {
                continue;
            }

            const category = property.apartments.length > 1 ? 'building' : 'house';
            const owned = hasPropertyAccess ? 'owned' : 'free';

            let name: string;
            let color = 0;
            if (hasPropertyAccess) {
                if (hasPlayerTenantOrRoommateApartment(property, player.citizenid)) {
                    name = 'Habitation - Résidence';
                } else if (hasPlayerOwnedNonEmptyApartment(property, player.citizenid)) {
                    color = 7;
                    name = 'Habitation - Location';
                } else if (hasPlayerOwnedEmptyApartment(property, player.citizenid)) {
                    color = 17;
                    name = 'Habitation - Location vide';
                } else {
                    name = 'Habitation - Résidence';
                }
            } else {
                if (category === 'building') {
                    name = 'Habitation - Immeuble';
                } else {
                    name = 'Habitation - Maison';
                }
            }

            if (this.blipFactory.exist(id)) {
                this.blipFactory.update(id, {
                    name,
                    position: property.entryZone.center,
                    sprite: BlipSprite[category][owned],
                    scale: owned === 'owned' ? 0.8 : 0.5,
                    color: color,
                });
            } else {
                this.blipFactory.create(id, {
                    name,
                    position: property.entryZone.center,
                    sprite: BlipSprite[category][owned],
                    scale: owned === 'owned' ? 0.8 : 0.5,
                    color: color,
                });
            }
        }
    }

    @RepositoryDelete(RepositoryType.Housing)
    public async removePropertyZone(property: Property) {
        this.targetFactory.removeBoxZone(`housing:property:${property.id}`);
        this.updateBlips();
    }

    @RepositoryInsert(RepositoryType.Housing)
    @RepositoryUpdate(RepositoryType.Housing)
    public async loadPropertyZone(property: Property) {
        this.targetFactory.removeBoxZone(`housing:property:${property.id}`);
        this.updateBlips();

        if (!property.entryZone) {
            return;
        }

        //meteor
        if (
            [
                'v_trailer_11',
                'v_trailer_12',
                'v_trailer_14',
                'v_trailer_15',
                'v_trailer_16',
                'v_trailer_17',
                'v_trailer_18',
                'v_trailer_24',
                'v_trailer_25',
            ].includes(property.identifier)
        ) {
            return;
        }

        this.targetFactory.createForBoxZone(`housing:property:${property.id}`, property.entryZone, [
            {
                label: 'Acheter',
                icon: 'housing/buy',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) && hasAvailableApartment(property) && !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.nuiMenu.openMenu(
                        MenuType.HousingBuyMenu,
                        {
                            property,
                            apartments: property.apartments.filter(apartment => {
                                return apartment.owner === null && apartment.senatePartyId === null;
                            }),
                        },
                        {
                            position: {
                                distance: Math.max(3, property.entryZone.width + property.entryZone.length),
                                position: property.entryZone.center,
                            },
                        }
                    );
                },
            },
            {
                label: 'Vendre',
                icon: 'housing/sell',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) &&
                        hasPlayerOwnedApartment(property, player.citizenid) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return;
                    }

                    this.nuiMenu.openMenu(
                        MenuType.HousingSellMenu,
                        {
                            property,
                            apartments: property.apartments.filter(apartment => {
                                return apartment.owner === player.citizenid;
                            }),
                        },
                        {
                            position: {
                                distance: Math.max(3, property.entryZone.width + property.entryZone.length),
                                position: property.entryZone.center,
                            },
                        }
                    );
                },
            },
            {
                label: 'Visiter',
                icon: 'housing/inspect',
                category: 'citizen',
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) && hasAvailableApartment(property) && !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.visitProperty(property);
                },
            },
            {
                label: property.apartments.length === 1 ? `Sonner - ${property.apartments[0].label}` : 'Sonner',
                icon: 'housing/bell',
                category: 'citizen',
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        hasApartmentWithoutAccessInProperty(property, player, this.temporaryAccess) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.bellProperty(property);
                },
            },
            {
                label: 'Utiliser un mandat de perquisition',
                icon: 'pawl/craft-paper',
                job: FDO.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {} as Record<JobType, number>),
                category: 'society',
                item: 'search_warrant',
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (isPlayerInsideApartment(player)) {
                        return false;
                    }

                    return property.apartments.some(
                        apartment =>
                            (apartment.owner || apartment.senatePartyId) &&
                            apartment.search_warrant_access <= Date.now()
                    );
                },
                action: () => {
                    this.useSearchWarrant(property);
                },
            },
            {
                label: 'Entrer',
                icon: 'housing/enter',
                category: 'citizen',
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return hasAccess(property, player, this.temporaryAccess) && !isPlayerInsideApartment(player);
                },
                action: () => {
                    this.enterProperty(property);
                },
            },
            {
                label: 'Garage',
                icon: 'housing/garage',
                category: 'citizen',
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        hasAccess(property, player, this.temporaryAccess) &&
                        hasPropertyGarage(property) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.openPropertyGarage(property);
                },
            },
            {
                label: 'Changer de résidence principale',
                icon: 'housing/house-user',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) &&
                        hasPlayerOwnedEmptyApartment(property, player.citizenid) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.changePrincipalApartement(property);
                },
            },
            {
                label: 'Ajouter un locataire',
                icon: 'jobs/enroll',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) &&
                        canPlayerAddTenant(property, player.citizenid) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.addTenant(property);
                },
            },
            {
                label: 'Ajouter un colocataire',
                icon: 'jobs/enroll',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) &&
                        canPlayerAddRoommate(property, player.citizenid) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.addRoommate(property);
                },
            },
            {
                label: 'Retirer locataire',
                icon: 'jobs/fire',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) &&
                        canPlayerRemoveTenant(property, player.citizenid) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.removeTenant(property);
                },
            },
            {
                label: 'Retirer colocataire',
                icon: 'jobs/fire',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) &&
                        canPlayerRemoveRoommate(property, player.citizenid) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.removeRoommate(property);
                },
            },
            {
                label: 'Partir de la location',
                icon: 'jobs/fire',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) &&
                        hasPlayerTenantApartment(property, player.citizenid) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.leavePropertyAsTenant(property);
                },
            },
            {
                label: 'Partir de la colocation',
                icon: 'jobs/fire',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) &&
                        hasPlayerRoommateApartment(property, player.citizenid) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.leavePropertyAsRoommate(property);
                },
            },
            {
                label: 'Stocker les meubles',
                icon: 'magasin/acheter',
                category: 'citizen',
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        canUseHousingInProperty(player, property, this.temporaryAccess) &&
                        this.inventoryManager.hasEnoughItem('zkea_crate')
                    );
                },
                action: async () => {
                    await this.storeFournitureInProperty(property);
                },
            },
        ]);
    }

    public async visitProperty(property: Property) {
        const apartment = this.getUniqueApartment(property);

        if (!apartment) {
            const apartments = property.apartments.filter(
                apartment => apartment.owner === null && apartment.senatePartyId === null
            );

            this.nuiMenu.openMenu(
                MenuType.HousingVisitMenu,
                {
                    property,
                    apartments,
                },
                {
                    position: {
                        distance: Math.max(3, property.entryZone.width + property.entryZone.length),
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        await this.housingMenuProvider.visit({ apartmentId: apartment.id, propertyId: property.id });
    }

    public async storeFournitureInProperty(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments = property.apartments.filter(apartment =>
            canUseHousingInAppartmentNoStaff(player, apartment, this.temporaryAccess)
        );

        if (apartments.length === 0) {
            return;
        }

        if (apartments.length > 1) {
            this.nuiMenu.openMenu(
                MenuType.HousingStoreFounitureSelectMenu,
                {
                    property,
                    apartments,
                },
                {
                    position: {
                        distance: 3,
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        this.housingMenuProvider.storeFournitureInApartment({
            apartmentId: apartments[0].id,
            propertyId: apartments[0].propertyId,
        });
    }

    public async enterProperty(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments = property.apartments.filter(
            apartment =>
                hasApartmentAccess(apartment, player, this.temporaryAccess) ||
                hasSearchWarrantAccessInApartment(apartment, player)
        );

        if (apartments.length === 0) {
            return;
        }

        if (apartments.length > 1) {
            this.nuiMenu.openMenu(
                MenuType.HousingEnterMenu,
                {
                    property,
                    apartments,
                },
                {
                    position: {
                        distance: Math.max(3, property.entryZone.width + property.entryZone.length),
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        await this.housingMenuProvider.enter({ apartmentId: apartments[0].id, propertyId: property.id });
    }

    public async bellProperty(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const apartment = this.getUniqueApartment(property);

        if (!apartment) {
            this.nuiMenu.openMenu(
                MenuType.HousingBellMenu,
                {
                    property,
                    apartments: property.apartments.filter(apartment => {
                        return (
                            (apartment.owner !== null || apartment.senatePartyId !== null) &&
                            !hasApartmentAccess(apartment, player, this.temporaryAccess)
                        );
                    }),
                },
                {
                    position: {
                        distance: Math.max(3, property.entryZone.width + property.entryZone.length),
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        await this.housingMenuProvider.bell({ apartmentId: apartment.id, propertyId: property.id });
    }

    public async useSearchWarrant(property: Property) {
        this.nuiMenu.openMenu(
            MenuType.HousingSearchWarrantMenu,
            {
                property,
                apartments: property.apartments.filter(apartment => {
                    return (
                        (apartment.owner || apartment.senatePartyId) && apartment.search_warrant_access <= Date.now()
                    );
                }),
            },
            {
                position: {
                    distance: 3,
                    position: property.entryZone.center,
                },
            }
        );
    }

    public async changePrincipalApartement(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments = property.apartments.filter(
            apartment =>
                apartment.owner === player.citizenid && apartment.tenant === null && apartment.roommate === null
        );

        if (apartments.length === 0) {
            return;
        }

        this.nuiMenu.openMenu(
            MenuType.HousingChangePrincipalApartementMenu,
            {
                property,
                apartments,
            },
            {
                position: {
                    distance: 3,
                    position: property.entryZone.center,
                },
            }
        );
    }

    @OnEvent(ClientEvent.HOUSING_SELECT_UPGRADES_MENU)
    public async selectUpgradesMenu() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments: Apartment[] = [];
        for (const property of this.housingRepository.get()) {
            for (const apartment of property.apartments.filter(apartment => apartment.owner === player.citizenid)) {
                apartments.push(apartment);
            }
        }

        if (apartments.length === 0) {
            return;
        }

        if (apartments.length > 1) {
            this.nuiMenu.openMenu(MenuType.HousingUpgradesSelectMenu, {
                apartments,
            });

            return;
        }

        TriggerEvent(ClientEvent.HOUSING_OPEN_UPGRADES_MENU, {
            apartmentId: apartments[0].id,
            propertyId: apartments[0].propertyId,
        });
    }

    public async addTenant(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments = property.apartments.filter(
            apartment => apartment.owner === player.citizenid && apartment.tenant === null
        );

        if (apartments.length === 0) {
            return;
        }

        if (apartments.length > 1) {
            this.nuiMenu.openMenu(
                MenuType.HousingAddTenantMenu,
                {
                    property,
                    apartments,
                },
                {
                    position: {
                        distance: 3,
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        await this.housingMenuProvider.addTenant({ apartmentId: apartments[0].id, propertyId: property.id });
    }

    public async addRoommate(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments = property.apartments.filter(
            apartment => apartment.owner === player.citizenid && apartment.roommate === null
        );

        if (apartments.length === 0) {
            return;
        }

        if (apartments.length > 1) {
            this.nuiMenu.openMenu(
                MenuType.HousingAddRoommateMenu,
                {
                    property,
                    apartments,
                },
                {
                    position: {
                        distance: Math.max(3, property.entryZone.width + property.entryZone.length),
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        await this.housingMenuProvider.addRoommate({ apartmentId: apartments[0].id, propertyId: property.id });
    }

    public async removeRoommate(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments = property.apartments.filter(
            apartment => apartment.owner === player.citizenid && apartment.roommate !== null
        );

        if (apartments.length === 0) {
            return;
        }

        if (apartments.length > 1) {
            this.nuiMenu.openMenu(
                MenuType.HousingRemoveRoommateMenu,
                {
                    property,
                    apartments,
                },
                {
                    position: {
                        distance: Math.max(3, property.entryZone.width + property.entryZone.length),
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        const confirm = await this.inputService.askConfirm(
            "Voulez-vous vraiment retirer l'accès de cette habituation au colocataire ? Entrez OUI pour confirmer"
        );

        if (!confirm) {
            return;
        }
        await this.housingMenuProvider.removeRoommate({ apartmentId: apartments[0].id, propertyId: property.id });
    }

    public async removeTenant(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments = property.apartments.filter(
            apartment =>
                apartment.owner === player.citizenid &&
                apartment.tenant !== null &&
                apartment.tenant !== player.citizenid
        );

        if (apartments.length === 0) {
            return;
        }

        if (apartments.length > 1) {
            this.nuiMenu.openMenu(
                MenuType.HousingRemoveTenantMenu,
                {
                    property,
                    apartments,
                },
                {
                    position: {
                        distance: 3,
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        await this.housingMenuProvider.removeTenant({ apartmentId: apartments[0].id, propertyId: property.id });
    }

    private getUniqueApartment(property: Property): Apartment | null {
        if (property.apartments.length > 1) {
            return null;
        }

        if (property.apartments.length === 0) {
            return null;
        }

        return property.apartments[0];
    }

    public async openPropertyGarage(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const apartments = property.apartments.filter(
            apartment =>
                hasApartmentAccess(apartment, player, this.temporaryAccess) ||
                hasSearchWarrantAccessInApartment(apartment, player)
        );

        await this.vehicleGarageProvider.openHouseGarageMenu(property.identifier, apartments);
    }

    public leavePropertyAsTenant(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const apartment = property.apartments.find(apartment => apartment.tenant === player.citizenid);

        if (!apartment) {
            return;
        }

        TriggerServerEvent(ServerEvent.HOUSING_REMOVE_TENANT, property.id, apartment.id);
    }

    public leavePropertyAsRoommate(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const apartment = property.apartments.find(apartment => apartment.roommate === player.citizenid);

        if (!apartment) {
            return;
        }

        TriggerServerEvent(ServerEvent.HOUSING_REMOVE_ROOMMATE, property.id, apartment.id);
    }
}
