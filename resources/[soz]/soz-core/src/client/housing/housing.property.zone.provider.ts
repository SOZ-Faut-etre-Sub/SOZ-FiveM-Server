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
    hasAvailableApartment,
    hasPlayerOwnedApartment,
    hasPlayerRentedApartment,
    hasPlayerRoommateApartment,
    hasPropertyGarage,
    hasRentedApartment,
    hasTemporaryAccess,
    isPlayerInsideApartment,
    Property,
} from '../../shared/housing/housing';
import { MenuType } from '../../shared/nui/menu';
import { RepositoryType } from '../../shared/repository';
import { RpcServerEvent } from '../../shared/rpc';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { HousingRepository } from '../repository/housing.repository';
import { TargetFactory } from '../target/target.factory';
import { VehicleGarageProvider } from '../vehicle/vehicle.garage.provider';
import { HousingMenuProvider } from './housing.menu.provider';

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
                if (
                    apartment.owner === player.citizenid ||
                    apartment.roommate === player.citizenid ||
                    this.temporaryAccess.has(apartment.id)
                ) {
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
    }

    @RepositoryDelete(RepositoryType.Housing)
    public removePropertyZone(property: Property) {
        this.targetFactory.removeBoxZone(`housing:property:${property.id}`);
    }

    @RepositoryInsert(RepositoryType.Housing)
    @RepositoryUpdate(RepositoryType.Housing)
    public loadPropertyZone(property: Property) {
        this.targetFactory.removeBoxZone(`housing:property:${property.id}`);

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
                        !hasPlayerOwnedApartment(property, player.citizenid) &&
                        hasAvailableApartment(property) &&
                        !isPlayerInsideApartment(player)
                    );
                },
                action: () => {
                    this.nuiMenu.openMenu(MenuType.HousingBuyMenu, {
                        property,
                        apartments: property.apartments.filter(apartment => {
                            return apartment.owner === null && apartment.senatePartyId === null;
                        }),
                    });
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

                    return hasPlayerOwnedApartment(property, player.citizenid) && !isPlayerInsideApartment(player);
                },
                action: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return;
                    }

                    this.nuiMenu.openMenu(MenuType.HousingSellMenu, {
                        property,
                        apartments: property.apartments.filter(apartment => {
                            return apartment.owner === player.citizenid;
                        }),
                    });
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

                    return hasAvailableApartment(property) && !isPlayerInsideApartment(player);
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

                    return (
                        (hasTemporaryAccess(property, this.temporaryAccess) ||
                            hasPlayerRentedApartment(property, player.citizenid)) &&
                        !isPlayerInsideApartment(player)
                    );
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

                    return hasPropertyGarage(property) && !isPlayerInsideApartment(player);
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

                    return canPlayerAddRoommate(property, player.citizenid) && !isPlayerInsideApartment(player);
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

                    return canPlayerRemoveRoommate(property, player.citizenid) && !isPlayerInsideApartment(player);
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

                    return hasPlayerRoommateApartment(property, player.citizenid) && !isPlayerInsideApartment(player);
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

            this.nuiMenu.openMenu(MenuType.HousingVisitMenu, {
                property,
                apartments,
            });

            return;
        }

        await this.housingMenuProvider.visit({ apartmentId: apartment.id, propertyId: property.id });
    }

    public async enterProperty(property: Property) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return [];
        }

        const apartments = property.apartments.filter(
            apartment =>
                apartment.owner === player.citizenid ||
                apartment.roommate === player.citizenid ||
                this.temporaryAccess.has(apartment.id)
        );

        if (apartments.length === 0) {
            return;
        }

        if (apartments.length > 1) {
            this.nuiMenu.openMenu(MenuType.HousingEnterMenu, {
                property,
                apartments,
            });

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
            this.nuiMenu.openMenu(MenuType.HousingBellMenu, {
                property,
                apartments: property.apartments.filter(apartment => {
                    return (
                        (apartment.owner !== null || apartment.senatePartyId !== null) &&
                        apartment.owner !== player.citizenid &&
                        apartment.roommate !== player.citizenid
                    );
                }),
            });

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
            this.nuiMenu.openMenu(MenuType.HousingAddRoommateMenu, {
                property,
                apartments,
            });

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
            this.nuiMenu.openMenu(MenuType.HousingRemoveRoommateMenu, {
                property,
                apartments,
            });

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
        await this.vehicleGarageProvider.openHouseGarageMenu(property.identifier);
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
