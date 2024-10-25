import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { RepositoryDelete, RepositoryInsert, RepositoryUpdate } from '@core/decorators/repository';
import { emitQBRpc } from '@core/rpc';
import { BankService } from '@public/client/bank/bank.service';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerService } from '@public/client/player/player.service';
import { HousingRepository } from '@public/client/repository/housing.repository';
import { TargetFactory } from '@public/client/target/target.factory';
import { PlayerCloakroomItem } from '@public/shared/cloth';
import { ServerEvent } from '@public/shared/event/server';
import {
    Apartment,
    canAccessTargetInApartment,
    canUseHousingInAppartment,
    isApartmentExcludeFromHousing,
    isPlayerInsideApartment,
    Property,
} from '@public/shared/housing/housing';
import { MenuType } from '@public/shared/nui/menu';
import { RepositoryType } from '@public/shared/repository';

import { InventoryType } from '../../shared/inventory';
import { Vector3 } from '../../shared/polyzone/vector';
import { HousingMenuProvider } from './housing.menu.provider';
import { HousingPropertyZoneProvider } from './housing.property.zone.provider';

type PlayerCloakroom = Record<number, PlayerCloakroomItem>;

@Provider()
export class HousingApartmentZoneProvider {
    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(HousingMenuProvider)
    private housingMenuProvider: HousingMenuProvider;

    @Inject(HousingPropertyZoneProvider)
    private housingPropertyZoneProvider: HousingPropertyZoneProvider;

    @Once(OnceStep.RepositoriesLoaded)
    public onApartmentZoneLoaded() {
        const properties = this.housingRepository.get();

        for (const property of properties) {
            this.createZoneForProperty(property);
        }
    }

    @RepositoryDelete(RepositoryType.Housing)
    public async deleteZoneForProperty(property: Property) {
        for (const apartment of property.apartments) {
            this.deleteZoneForApartment(apartment);
        }
    }

    @RepositoryInsert(RepositoryType.Housing)
    @RepositoryUpdate(RepositoryType.Housing)
    public async createZoneForProperty(property: Property) {
        for (const apartment of property.apartments) {
            this.createZoneForApartment(property, apartment);
        }
    }

    public deleteZoneForApartment(apartment: Apartment) {
        this.targetFactory.removeBoxZone(`housing:apartment:${apartment.id}:exit`);
        this.deleteOtherzoneForApartment(apartment);
    }

    public deleteOtherzoneForApartment(apartment: Apartment) {
        this.targetFactory.removeBoxZone(`housing:apartment:${apartment.id}:stash`);
        this.targetFactory.removeBoxZone(`housing:apartment:${apartment.id}:fridge`);
        this.targetFactory.removeBoxZone(`housing:apartment:${apartment.id}:money`);
        this.targetFactory.removeBoxZone(`housing:apartment:${apartment.id}:closet`);
    }

    public createZoneForApartment(property: Property, apartment: Apartment) {
        this.deleteZoneForApartment(apartment);

        if (apartment.exitZone) {
            this.targetFactory.createForBoxZone(`housing:apartment:${apartment.id}:exit`, apartment.exitZone, [
                {
                    label: 'Sortir',
                    icon: 'housing/enter',
                    category: 'citizen',
                    event: 'all',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return isPlayerInsideApartment(player);
                    },
                    action: () => {
                        TriggerServerEvent(ServerEvent.HOUSING_EXIT_APARTMENT, property.id, apartment.id);
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
                            (apartment.senatePartyId !== null || apartment.owner !== null) &&
                            canUseHousingInAppartment(
                                player,
                                apartment,
                                this.housingPropertyZoneProvider.temporaryAccess
                            ) &&
                            this.inventoryManager.hasEnoughItem('zkea_crate')
                        );
                    },
                    action: async () => {
                        await this.housingMenuProvider.storeFournitureInApartment({
                            apartmentId: apartment.id,
                            propertyId: apartment.propertyId,
                        });
                    },
                },
            ]);
        }

        if (!isApartmentExcludeFromHousing(apartment) && !apartment.shell) {
            return;
        }

        this.createOtherZoneForApartment(property.id, apartment);
    }

    public createOtherZoneForApartment(propertyId: number, apartment: Apartment) {
        if (apartment.stashZone) {
            this.targetFactory.createForBoxZone(`housing:apartment:${apartment.id}:stash`, apartment.stashZone, [
                {
                    label: 'Coffre de stockage',
                    icon: 'inventory/ouvrir_le_stockage',
                    category: 'citizen',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();
                        return canAccessTargetInApartment(player, apartment);
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
        }

        if (apartment.fridgeZone) {
            this.targetFactory.createForBoxZone(`housing:apartment:${apartment.id}:fridge`, apartment.fridgeZone, [
                {
                    label: 'Frigo',
                    icon: 'food/carrot',
                    category: 'citizen',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();
                        return canAccessTargetInApartment(player, apartment);
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
        }

        if (apartment.moneyZone) {
            this.targetFactory.createForBoxZone(`housing:apartment:${apartment.id}:money`, apartment.moneyZone, [
                {
                    label: "Coffre d'argent",
                    icon: 'bank/compte_safe',
                    category: 'citizen',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();
                        return canAccessTargetInApartment(player, apartment);
                    },
                    action: () => {
                        this.bankService.openHouseSafe(apartment);
                    },
                },
            ]);
        }

        if (apartment.closetZone) {
            this.targetFactory.createForBoxZone(`housing:apartment:${apartment.id}:closet`, apartment.closetZone, [
                {
                    label: 'Penderie',
                    icon: 'jobs/habiller',
                    category: 'citizen',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();
                        return canAccessTargetInApartment(player, apartment);
                    },
                    action: () => {
                        this.openApartmentCloakroom();
                    },
                },
            ]);
        }
    }

    public async openApartmentCloakroom(gang = false) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const playerCloakroom = await emitQBRpc<PlayerCloakroom>('soz-character:server:GetPlayerCloakroom');

        if (!playerCloakroom) {
            return;
        }

        const cloakroomItems = Object.values(playerCloakroom);

        this.nuiMenu.openMenu(MenuType.HousingCloakroomMenu, {
            items: cloakroomItems,
            gang,
        });
    }
}
