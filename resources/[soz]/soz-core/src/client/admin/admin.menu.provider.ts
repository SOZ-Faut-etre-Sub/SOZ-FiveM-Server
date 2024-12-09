import { HalloweenSubMenuState, MeteorSubMenuState } from '@public/shared/admin/admin';

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
import { EventInfo } from '../../shared/scene';
import { ClothingService } from '../clothing/clothing.service';
import { DoorProvider } from '../door/door.provider';
import { HudMinimapProvider } from '../hud/hud.minimap.provider';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { SenateRepository } from '../repository/senate.repository';
import { TargetProvider } from '../target/target.provider';
import { VehicleDamageProvider } from '../vehicle/vehicle.damage.provider';
import { VehicleOffroadProvider } from '../vehicle/vehicle.offroad.provider';
import { VehiclePoliceLocator } from '../vehicle/vehicle.police.locator.provider';
import { AdminMenuDeveloperProvider } from './admin.menu.developer.provider';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';
import { AdminMenuVehicleProvider } from './admin.menu.vehicle.provider';

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

    @Inject(VehicleDamageProvider)
    private vehicleDamageProvider: VehicleDamageProvider;

    @Inject(VehicleOffroadProvider)
    private vehicleOffroadProvider: VehicleOffroadProvider;

    @Inject(HudMinimapProvider)
    private hudMinimapProvider: HudMinimapProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehiclePoliceLocator)
    private vehiclePoliceLocator: VehiclePoliceLocator;

    @Inject(SenateRepository)
    private senateRepository: SenateRepository;

    @Inject(AdminMenuVehicleProvider)
    private adminMenuVehicleProvider: AdminMenuVehicleProvider;

    @Inject(DoorProvider)
    private doorProvider: DoorProvider;

    @Inject(TargetProvider)
    private targetProvider: TargetProvider;

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
        const meteorState = await emitRpc<MeteorSubMenuState>(RpcServerEvent.ADMIN_METEOR_STATE);
        const halloweenState = await emitRpc<HalloweenSubMenuState>(RpcServerEvent.ADMIN_HALLOWEEN_GAME_STATE);
        const eventInfo = await emitRpc<EventInfo>(RpcServerEvent.WORLD_EVENT_GET_INFO);

        this.nuiMenu.openMenu<MenuType.AdminMenu>(
            MenuType.AdminMenu,
            {
                banner,
                characters,
                event: eventInfo,
                permission: permission as SozRole,
                parties: this.senateRepository.get(),
                state: {
                    gameMaster: {
                        invisible: !IsEntityVisible(ped),
                        moneyCase: this.playerService.getState().disableMoneyCase,
                        adminGPS: this.hudMinimapProvider.hasAdminGps,
                        adminPoliceLocator: this.vehiclePoliceLocator.getAdminEnabled(),
                    },
                    interactive: {
                        displayOwners: this.adminMenuInteractiveProvider.intervalHandlers.displayOwners !== null,
                        displayDebugSurface: this.vehicleOffroadProvider.displayDebugSurface,
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
                        displayCoords: this.adminMenuDeveloperProvider.showCoordinates,
                        displayMileage: this.adminMenuDeveloperProvider.showMileage,
                        displayMouseDebug: this.adminMenuDeveloperProvider.showMouseDebug,
                        doors: this.doorProvider.isAdminEnabled(),
                        debugPoly: this.targetProvider.isDebugPoly(),
                    },
                    vehicule: {
                        noStall: this.vehicleDamageProvider.getAdminNoStall(),
                        noBurstTyres: this.adminMenuVehicleProvider.getNoBurstTyres(),
                        noSurfaceCalc: this.vehicleOffroadProvider.getNoSurfaceCalc(),
                    },
                    meteor: meteorState,
                    halloween: halloweenState,
                    ceremony: {
                        disableNpc: meteorState.disableNpc,
                    },
                },
            },
            { subMenuId }
        );
    }
}
