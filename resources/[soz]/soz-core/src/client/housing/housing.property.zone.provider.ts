import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { RepositoryDelete, RepositoryInsert, RepositoryUpdate } from '../../core/decorators/repository';
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
    isPlayerInsideApartment,
    Property,
} from '../../shared/housing/housing';
import { MenuType } from '../../shared/nui/menu';
import { RepositoryType } from '../../shared/repository';
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
                    this.nuiMenu.openMenu(MenuType.HousingBuyMenu, property);
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
                    this.nuiMenu.openMenu(MenuType.HousingSellMenu, property);
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

                    return hasPlayerRentedApartment(property, player.citizenid) && !isPlayerInsideApartment(player);
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
            this.nuiMenu.openMenu(MenuType.HousingVisitMenu, property);

            return;
        }

        await this.housingMenuProvider.visit({ apartmentId: apartment.id, propertyId: property.id });
    }

    public async enterProperty(property: Property) {
        const apartment = this.getRentedApartment(property);

        if (!apartment) {
            this.nuiMenu.openMenu(MenuType.HousingEnterMenu, property);

            return;
        }

        await this.housingMenuProvider.enter({ apartmentId: apartment.id, propertyId: property.id });
    }

    public async bellProperty(property: Property) {
        const apartment = this.getUniqueApartment(property);

        if (!apartment) {
            this.nuiMenu.openMenu(MenuType.HousingBellMenu, property);

            return;
        }

        await this.housingMenuProvider.bell({ apartmentId: apartment.id, propertyId: property.id });
    }

    public async addRoommate(property: Property) {
        const apartment = this.getRentedApartment(property);

        if (!apartment) {
            this.nuiMenu.openMenu(MenuType.HousingAddRoommateMenu, property);

            return;
        }

        await this.housingMenuProvider.addRoommate({ apartmentId: apartment.id, propertyId: property.id });
    }

    public async removeRoommate(property: Property) {
        const apartment = this.getRentedApartment(property);

        if (!apartment) {
            this.nuiMenu.openMenu(MenuType.HousingRemoveRoommateMenu, property);

            return;
        }

        await this.housingMenuProvider.removeRoommate({ apartmentId: apartment.id, propertyId: property.id });
    }

    private getRentedApartment(property: Property): Apartment | null {
        const player = this.playerService.getPlayer();

        if (!player) {
            return null;
        }

        const apartments = property.apartments.filter(
            apartment => apartment.owner === player.citizenid || apartment.roommate === player.citizenid
        );

        if (apartments.length > 1) {
            return null;
        }

        if (apartments.length === 0) {
            return null;
        }

        return apartments[0];
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
