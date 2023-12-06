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

        if (!player.metadata.inside || !player.metadata.inside.property) {
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
            "Une personne souhaite entrer dans votre appartement.~n~Faites ~g~Y~s~ pour l'accepter ou ~r~N~s~ pour la refuser"
        );

        if (confirmed) {
            TriggerServerEvent(ServerEvent.HOUSING_ENTER_APARTMENT, propertyId, apartmentId, target);
        }
    }

    @OnNuiEvent<{
        tier: number;
        price: number;
        zkeaPrice: number;
        enableParking: boolean;
        hasParking: number;
        parkingPrice: number;
    }>(NuiEvent.HousingUpgradeApartment)
    public async upgradeApartment({ tier, price, zkeaPrice, enableParking, hasParking, parkingPrice }) {
        const player = this.playerService.getPlayer();
        if (!player.apartment) {
            this.notifier.notify("Vous n'avez pas d'appartement !", 'error');
            return;
        }

        const {
            apartment: { tier: currentTier },
            money: { money },
        } = player;
        if (tier < currentTier) {
            this.notifier.notify('Vous ne pouvez pas rétrograder de palier !', 'error');
            return;
        }

        const requiredMoney = price + enableParking && hasParking ? parkingPrice : 0;

        if (money < requiredMoney) {
            this.notifier.notify("Vous n'avez pas assez d'argent !", 'error');
            return;
        }

        if (price > 0 && zkeaPrice > 0) {
            TriggerServerEvent(ServerEvent.HOUSING_UPGRADE_APARTMENT_TIER, tier, price, zkeaPrice);
        }

        if (enableParking && hasParking && parkingPrice > 0) {
            TriggerServerEvent(ServerEvent.HOUSING_ADD_PARKING_PLACE, hasParking, parkingPrice);
        }

        this.nuiMenu.closeMenu();
    }

    @OnEvent(ClientEvent.HOUSING_OPEN_UPGRADES_MENU)
    public async openUpgradesMenu() {
        const player = this.playerService.getPlayer();

        if (!player.apartment) {
            this.notifier.notify("Vous n'avez pas d'appartement !", 'error');
            return;
        }

        const { id, tier, price, property_id } = player.apartment;

        const property = this.housingRepository.findProperty(property_id);

        if (!property) {
            this.notifier.notify("Cet appartement n'appartient à aucune propriété !", 'error');
            return;
        }

        const enableParking = property.identifier.includes('trailer');

        let hasParking = true;

        if (enableParking) {
            const apartment = property.apartments[id];

            hasParking = apartment && apartment.hasParkingPlace;
        }

        const position = GetEntityCoords(GetPlayerPed(-1)) as Vector3;

        this.nuiMenu.openMenu(
            MenuType.HousingUpgrades,
            {
                apartmentPrice: price,
                currentTier: tier,
                hasParking,
                enableParking,
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
