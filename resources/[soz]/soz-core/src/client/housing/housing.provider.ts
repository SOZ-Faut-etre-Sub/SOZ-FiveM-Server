import { ApartementTiers, isTrailer } from '@public/shared/housing/housing';
import { TYPE_LABEL } from '@public/shared/housing/upgrades';

import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Vector3 } from '../../shared/polyzone/vector';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { HousingRepository } from '../repository/housing.repository';

@Provider()
export class HousingProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Tick()
    public enableCulling() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (!player.metadata?.inside || !player.metadata.inside.property) {
            return;
        }

        const property = this.housingRepository.findProperty(player.metadata.inside.property);

        if (!property) {
            return;
        }

        for (const culling of property.exteriorCulling) {
            EnableExteriorCullModelThisFrame(culling);
        }
    }

    @OnEvent(ClientEvent.HOUSING_REQUEST_ENTER)
    public async requestEnter(propertyId: number, apartmentId: number, target: number) {
        const confirmed = await this.notifier.notifyWithConfirm(
            "Une personne souhaite entrer dans votre habitation.~n~Faites ~g~Y~s~ pour l'accepter ou ~r~N~s~ pour la refuser"
        );

        if (confirmed) {
            TriggerServerEvent(ServerEvent.HOUSING_ENTER_APARTMENT, propertyId, apartmentId, target);
        }
    }

    @OnNuiEvent<{
        apartmentTier: ApartementTiers;
        price: number;
        zkeaPrice: number;
        isApartmentTrailer: boolean;
        hasParking: number;
        parkingPrice: number;
    }>(NuiEvent.HousingUpgradeApartment)
    public async upgradeApartment({ apartmentTier, price, isApartmentTrailer, hasParking, parkingPrice }) {
        const player = this.playerService.getPlayer();
        if (!player.apartment) {
            this.notifier.notify("Vous n'avez pas d'habitation !", 'error');
            return;
        }

        const {
            apartment,
            money: { money },
        } = player;

        const editedTier: Partial<ApartementTiers> = {};
        for (const type of Object.keys(TYPE_LABEL)) {
            if (apartmentTier[type] < apartment[type]) {
                this.notifier.notify('Vous ne pouvez pas rétrograder de palier !', 'error');
                return;
            } else if (apartmentTier[type] > apartment[type]) {
                editedTier[type] = apartmentTier[type];
            }
        }

        const requiredMoney = price + isApartmentTrailer && hasParking ? parkingPrice : 0;

        if (money < requiredMoney) {
            this.notifier.notify("Vous n'avez pas assez d'argent !", 'error');
            return;
        }

        if (Object.keys(editedTier).length > 0) {
            TriggerServerEvent(ServerEvent.HOUSING_UPGRADE_APARTMENT_TIER, editedTier);
        }

        if (isApartmentTrailer && hasParking && parkingPrice > 0) {
            TriggerServerEvent(ServerEvent.HOUSING_ADD_PARKING_PLACE, hasParking);
        }

        this.nuiMenu.closeMenu();
    }

    @OnEvent(ClientEvent.HOUSING_OPEN_UPGRADES_MENU)
    public async openUpgradesMenu() {
        const player = this.playerService.getPlayer();

        if (!player.apartment) {
            this.notifier.notify("Vous n'avez pas d'habitation !", 'error');
            return;
        }

        const { id, tier, cloth_tier, money_tier, park_tier, price, property_id } = player.apartment;

        const property = this.housingRepository.findProperty(property_id);

        if (!property) {
            this.notifier.notify("Cet habitation n'appartient à aucune propriété !", 'error');
            return;
        }

        const isApartmentTrailer = isTrailer(property);

        let hasParking = true;

        if (isApartmentTrailer) {
            const apartment = property.apartments.find(apartment => apartment.id === id);

            hasParking = apartment && apartment.hasParkingPlace;
        }

        const position = GetEntityCoords(PlayerPedId()) as Vector3;

        this.nuiMenu.openMenu(
            MenuType.HousingUpgrades,
            {
                apartmentPrice: price,
                currentTier: {
                    tier,
                    cloth_tier,
                    money_tier,
                    park_tier,
                },
                hasParking,
                isApartmentTrailer,
            },
            {
                position: {
                    position,
                    distance: 3,
                },
            }
        );
    }
}
