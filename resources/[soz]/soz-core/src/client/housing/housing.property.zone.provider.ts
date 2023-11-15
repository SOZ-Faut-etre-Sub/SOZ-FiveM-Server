import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event/server';
import {
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
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { HousingRepository } from '../repository/housing.repository';
import { TargetFactory } from '../target/target.factory';
import { VehicleGarageProvider } from '../vehicle/vehicle.garage.provider';

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

    @Once(OnceStep.RepositoriesLoaded)
    public loadZones() {
        const properties = this.housingRepository.get();

        for (const property of properties) {
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
                        this.nuiMenu.openMenu(MenuType.HousingVisitMenu, property);
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
                        this.nuiMenu.openMenu(MenuType.HousingBellMenu, property);
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
                        this.nuiMenu.openMenu(MenuType.HousingEnterMenu, property);
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
                        this.nuiMenu.openMenu(MenuType.HousingAddRoommateMenu, property);
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
                        this.nuiMenu.openMenu(MenuType.HousingRemoveRoommateMenu, property);
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
                            hasPlayerRoommateApartment(property, player.citizenid) && !isPlayerInsideApartment(player)
                        );
                    },
                    action: () => {
                        this.leavePropertyAsRoommate(property);
                    },
                },
            ]);
        }
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
