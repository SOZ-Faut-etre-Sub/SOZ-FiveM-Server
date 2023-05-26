import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { SozRole } from '../../core/permissions';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { PlayerCharInfo } from '../../shared/player';
import { RpcServerEvent } from '../../shared/rpc';
import { ClothingService } from '../clothing/clothing.service';
import { HudMinimapProvider } from '../hud/hud.minimap.provider';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { VehicleConditionProvider } from '../vehicle/vehicle.condition.provider';
import { AdminMenuDeveloperProvider } from './admin.menu.developer.provider';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';

@Provider()
export class AdminMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Inject(AdminMenuInteractiveProvider)
    private adminMenuInteractiveProvider: AdminMenuInteractiveProvider;

    @Inject(AdminMenuDeveloperProvider)
    private adminMenuDeveloperProvider: AdminMenuDeveloperProvider;

    @Inject(VehicleConditionProvider)
    private vehicleConditionProvider: VehicleConditionProvider;

    @Inject(HudMinimapProvider)
    private hudMinimapProvider: HudMinimapProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnEvent(ClientEvent.ADMIN_OPEN_MENU)
    @Command('admin', {
        keys: [
            {
                mapper: 'keyboard',
                key: 'F9',
            },
        ],
    })
    public async openAdminMenu(subMenuId?: string): Promise<void> {
        const [isAllowed, permission] = await emitRpc<[boolean, string]>(RpcServerEvent.ADMIN_IS_ALLOWED);
        if (!isAllowed) {
            return;
        }

        if (this.nuiMenu.getOpened() === MenuType.AdminMenu) {
            this.nuiMenu.closeMenu();

            return;
        }

        const banner = 'https://nui-img/soz/menu_admin_' + permission;
        const ped = PlayerPedId();
        const characters = await emitRpc<Record<string, PlayerCharInfo>>(RpcServerEvent.ADMIN_GET_CHARACTERS);

        this.nuiMenu.openMenu<MenuType.AdminMenu>(
            MenuType.AdminMenu,
            {
                banner,
                characters,
                permission: permission as SozRole,
                state: {
                    gameMaster: {
                        invisible: !IsEntityVisible(ped),
                        moneyCase: this.playerService.getState().disableMoneyCase,
                        adminGPS: this.hudMinimapProvider.hasAdminGps,
                    },
                    interactive: {
                        displayOwners: this.adminMenuInteractiveProvider.intervalHandlers.displayOwners !== null,
                        displayPlayerNames:
                            this.adminMenuInteractiveProvider.intervalHandlers.displayPlayerNames !== null,
                        displayPlayersOnMap:
                            this.adminMenuInteractiveProvider.intervalHandlers.displayPlayersOnMap !== null,
                    },
                    skin: {
                        clothConfig: this.clothingService.getClothSet(),
                        maxOptions: this.clothingService.getMaxOptions(),
                    },
                    developer: {
                        noClip: this.adminMenuDeveloperProvider.isIsNoClipMode(),
                        displayCoords: this.adminMenuDeveloperProvider.showCoordinates !== null,
                        displayMileage: this.adminMenuDeveloperProvider.showMileage !== null,
                    },
                    vehicule: {
                        noStall: this.vehicleConditionProvider.getAdminNoStall(),
                    },
                },
            },
            { subMenuId }
        );
    }
}
