import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { emitQBRpc } from '../../core/rpc';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { PlayerData } from '../../shared/player';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { BlipFactory } from '../blip';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { HousingRepository } from '../repository/housing.repository';

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
export class HousingProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private blips = [];

    @Tick()
    public enableCulling() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (!player.metadata.inside) {
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

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    public updateBlips(player: PlayerData) {
        const hasMap = this.inventoryManager.getItemCount('house_map');

        if (!hasMap && this.blips.length > 0) {
            // Delete blips
            for (const blip of this.blips) {
                this.blipFactory.remove(blip);
            }
        }

        if (hasMap && this.blips.length === 0) {
            // Create blips
            const properties = this.housingRepository.get();
            const newBlips = [];

            for (const property of properties) {
                const id = `property_${property.id}`;
                const category = property.apartments.length > 1 ? 'building' : 'house';
                let owned = 'free';

                for (const apartment of property.apartments) {
                    if (apartment.owner === player.citizenid || apartment.roommate === player.citizenid) {
                        owned = 'owned';
                        break;
                    }
                }

                newBlips.push(id);

                this.blipFactory.create(id, {
                    name: 'Habitation',
                    position: property.entryZone.center,
                    sprite: BlipSprite[category][owned],
                    scale: owned === 'owned' ? 0.8 : 0.5,
                });
            }
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
        const properties = await emitQBRpc('housing:server:GetAllProperties' as RpcServerEvent);
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

    @OnEvent(ClientEvent.HOUSING_REQUEST_ENTER)
    public async requestEnter(propertyId: number, apartmentId: number, target: number) {
        const confirmed = await this.notifier.notifyWithConfirm(
            "Une personne souhaite entrer dans votre appartement.~n~Faites ~g~Y~s~ pour l'accepter ou ~r~N~s~ pour la refuser"
        );

        if (confirmed) {
            TriggerServerEvent(ServerEvent.HOUSING_ENTER_APARTMENT, propertyId, apartmentId, target);
        }
    }
}
