import { PlayerUpdate } from '@public/core/decorators/player';

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
    canPlayerRemoveRoommate,
    hasAccess,
    hasApartmentAccess,
    hasAvailableApartment,
    hasPlayerOwnedApartment,
    hasPlayerRoommateApartment,
    hasPropertyGarage,
    hasRentedApartment,
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

    private temporaryAccess = new Set<number>();

    @Exportable('GetPlayerApartmentAccess')
    public getPlayerAccess() {
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

    @PlayerUpdate()
    public updateBlips() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const hasMap = this.inventoryManager.hasEnoughItem('house_map');
        const properties = this.housingRepository.get();

        if (properties.length === 0) {
            return;
        }

        for (const property of properties) {
            const id = `property_${property.id}`;
            const hasPropertyAccess = hasAccess(property, player, this.temporaryAccess);
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
            const name = hasPropertyAccess
                ? 'Habitation - Résidence'
                : category === 'building'
                ? 'Habitation - Immeuble'
                : 'Habitation - Maison';

            if (this.blipFactory.exist(id)) {
                this.blipFactory.update(id, {
                    name,
                    position: property.entryZone.center,
                    sprite: BlipSprite[category][owned],
                    scale: owned === 'owned' ? 0.8 : 0.5,
                    color: 0,
                });
            } else {
                this.blipFactory.create(id, {
                    name,
                    position: property.entryZone.center,
                    sprite: BlipSprite[category][owned],
                    scale: owned === 'owned' ? 0.8 : 0.5,
                    color: 0,
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

        this.targetFactory.createForBoxZone(`housing:property:${property.id}`, property.entryZone, [
            {
                label: 'Acheter',
                icon: 'c:housing/buy.png',
                blackoutGlobal: true,
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return (
                        !isAdminHouse(property) &&
                        !hasPlayerOwnedApartment(property, player.citizenid) &&
                        hasAvailableApartment(property) &&
                        !isPlayerInsideApartment(player)
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
                                distance: 3,
                                position: property.entryZone.center,
                            },
                        }
                    );
                },
            },
            {
                label: 'Vendre',
                icon: 'c:housing/sell.png',
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
                                distance: 3,
                                position: property.entryZone.center,
                            },
                        }
                    );
                },
            },
            {
                label: 'Visiter',
                icon: 'c:housing/inspect.png',
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
                label: 'Sonner',
                icon: 'c:housing/bell.png',
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return hasRentedApartment(property, player.citizenid) && !isPlayerInsideApartment(player);
                },
                action: () => {
                    this.bellProperty(property);
                },
            },
            {
                label: 'Entrer',
                icon: 'c:housing/enter.png',
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
                icon: 'c:housing/garage.png',
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
                label: 'Ajouter colocataire',
                icon: 'c:jobs/enroll.png',
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
                label: 'Retirer colocataire',
                icon: 'c:jobs/fire.png',
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
                label: 'Partir de la colocation',
                icon: 'c:jobs/fire.png',
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
                        distance: 3,
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        await this.housingMenuProvider.visit({ apartmentId: apartment.id, propertyId: property.id });
    }

    public async enterProperty(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments = property.apartments.filter(apartment =>
            hasApartmentAccess(apartment, player, this.temporaryAccess)
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
                        distance: 3,
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
                        distance: 3,
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        await this.housingMenuProvider.bell({ apartmentId: apartment.id, propertyId: property.id });
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
                        distance: 3,
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
                        distance: 3,
                        position: property.entryZone.center,
                    },
                }
            );

            return;
        }

        await this.housingMenuProvider.removeRoommate({ apartmentId: apartments[0].id, propertyId: property.id });
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

        const apartments = property.apartments.filter(apartment =>
            hasApartmentAccess(apartment, player, this.temporaryAccess)
        );

        await this.vehicleGarageProvider.openHouseGarageMenu(property.identifier, apartments);
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
