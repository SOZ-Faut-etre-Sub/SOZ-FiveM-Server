import { MenuType } from '../../shared/nui/menu';
import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../shared/event';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { Notifier } from '../notifier';
import { emitQBRpc } from '../../core/rpc';
import { RpcEvent } from '../../shared/rpc';

@Provider()
export class HousingProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

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

        if (price > 0 && zkeaPrice > 0)
            TriggerServerEvent('housing:server:UpgradePlayerApartmentTier', tier, price, zkeaPrice);
        if (enableParking)
            TriggerServerEvent('housing:server:SetPlayerApartmentParkingPlace', hasParking, parkingPrice);
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
        const properties = await emitQBRpc('housing:server:GetAllProperties' as RpcEvent);
        const property = properties[property_id];
        if (!property) {
            this.notifier.notify("Cet appartement n'appartient à aucune propriété !", 'error');
            return;
        }
        const enableParking = property.identifier.includes('trailer');
        let hasParking = true;
        if (enableParking) {
            const apartment = property.apartments[id.toString()];
            hasParking = apartment && apartment.has_parking_place === 1;
        }
        this.nuiMenu.openMenu(MenuType.HousingUpgrades, {
            apartmentPrice: price,
            currentTier: tier,
            hasParking,
            enableParking,
        });
    }
}
