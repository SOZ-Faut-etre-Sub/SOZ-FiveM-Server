import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { RepositoryDelete, RepositoryInsert, RepositoryUpdate } from '../../core/decorators/repository';
import { emitQBRpc } from '../../core/rpc';
import { PlayerCloakroomItem } from '../../shared/cloth';
import { ServerEvent } from '../../shared/event/server';
import { Apartment, isPlayerInsideApartment, Property } from '../../shared/housing/housing';
import { MenuType } from '../../shared/nui/menu';
import { RepositoryType } from '../../shared/repository';
import { BankService } from '../bank/bank.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { HousingRepository } from '../repository/housing.repository';
import { TargetFactory } from '../target/target.factory';

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

    @Once(OnceStep.RepositoriesLoaded)
    public onApartmentZoneLoaded() {
        const properties = this.housingRepository.get();

        for (const property of properties) {
            this.createZoneForProperty(property);
        }
    }

    @RepositoryDelete(RepositoryType.Housing)
    public deleteZoneForProperty(property: Property) {
        for (const apartment of property.apartments) {
            this.deleteZoneForApartment(apartment);
        }
    }

    @RepositoryInsert(RepositoryType.Housing)
    @RepositoryUpdate(RepositoryType.Housing)
    public createZoneForProperty(property: Property) {
        for (const apartment of property.apartments) {
            this.createZoneForApartment(property, apartment);
        }
    }

    public deleteZoneForApartment(apartment: Apartment) {
        this.targetFactory.removeBoxZone(`housing:apartment:${apartment.id}:exit`);
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
                    icon: 'c:housing/enter.png',
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
            ]);
        }

        if (apartment.stashZone) {
            this.targetFactory.createForBoxZone(`housing:apartment:${apartment.id}:stash`, apartment.stashZone, [
                {
                    label: 'Sortir',
                    icon: 'c:inventory/ouvrir_le_stockage.png',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return apartment.owner !== null && isPlayerInsideApartment(player);
                    },
                    action: () => {
                        this.inventoryManager.openInventory('house_stash', apartment.identifier, {
                            apartmentTier: apartment.tier,
                            propertyId: property.id,
                            apartmentId: apartment.id,
                        });
                    },
                },
            ]);
        }

        if (apartment.fridgeZone) {
            this.targetFactory.createForBoxZone(`housing:apartment:${apartment.id}:fridge`, apartment.fridgeZone, [
                {
                    label: 'Frigo',
                    icon: 'c:inventory/ouvrir_le_stockage.png',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return apartment.owner !== null && isPlayerInsideApartment(player);
                    },
                    action: () => {
                        this.inventoryManager.openInventory('house_fridge', apartment.identifier);
                    },
                },
            ]);
        }

        if (apartment.moneyZone) {
            this.targetFactory.createForBoxZone(`housing:apartment:${apartment.id}:money`, apartment.moneyZone, [
                {
                    label: "Coffre d'argent",
                    icon: 'c:bank/compte_safe.png',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return apartment.owner !== null && isPlayerInsideApartment(player);
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
                    icon: 'c:jobs/habiller.png',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return apartment.owner !== null && isPlayerInsideApartment(player);
                    },
                    action: () => {
                        this.openApartmentCloakroom();
                    },
                },
            ]);
        }
    }

    public async openApartmentCloakroom() {
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
        });
    }
}
