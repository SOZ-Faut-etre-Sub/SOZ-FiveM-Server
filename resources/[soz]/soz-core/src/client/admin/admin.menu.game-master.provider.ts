import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { HudMinimapProvider } from '../hud/hud.minimap.provider';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { VehiclePoliceLocator } from '../vehicle/vehicle.police.locator.provider';

@Provider()
export class AdminMenuGameMasterProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(HudMinimapProvider)
    private hudMinimapProvider: HudMinimapProvider;

    @Inject(VehiclePoliceLocator)
    private vehiclePoliceLocator: VehiclePoliceLocator;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnNuiEvent(NuiEvent.AdminGiveMoney)
    public async giveMoney(amount: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_ADD_MONEY, 'money', amount);
        this.notifier.notify(`Vous vous êtes donné ${amount}$ en argent propre.`, 'success');
    }

    @OnNuiEvent(NuiEvent.AdminGiveMarkedMoney)
    public async giveMarkedMoney(amount: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_ADD_MONEY, 'marked_money', amount);
        this.notifier.notify(`Vous vous êtes donné ${amount}$ en argent sale.`, 'success');
    }

    @OnNuiEvent(NuiEvent.AdminTeleportToWaypoint)
    public async teleportToWaypoint(): Promise<void> {
        const waypoint = GetFirstBlipInfoId(8);

        if (DoesBlipExist(waypoint)) {
            const waypointCoords = GetBlipInfoIdCoord(waypoint);

            SetPedCoordsKeepVehicle(PlayerPedId(), waypointCoords[0], waypointCoords[1], waypointCoords[2]);
            for (let height = waypointCoords[2]; height < 1000; height += 1) {
                const [found, z] = GetGroundZFor_3dCoord_2(waypointCoords[0], waypointCoords[1], height, false);

                if (found) {
                    SetPedCoordsKeepVehicle(PlayerPedId(), waypointCoords[0], waypointCoords[1], z);
                    return;
                }
                await wait(1);
            }
        }
    }

    @OnNuiEvent(NuiEvent.AdminGiveLicence)
    public async giveLicence(licence: string): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_ADD_LICENSE, licence);
    }

    @OnNuiEvent(NuiEvent.AdminToggleMoneyCase)
    public async toggleDisableMoneyCase(value: boolean): Promise<void> {
        await this.playerService.updateState({ disableMoneyCase: !value });
    }

    @OnNuiEvent(NuiEvent.AdminSetVisible)
    public async setVisible(value: boolean): Promise<void> {
        SetEntityVisible(PlayerPedId(), value, false);
    }

    @OnNuiEvent(NuiEvent.AdminAutoPilot)
    public async setAutoPilot(): Promise<void> {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        const waypoint = GetFirstBlipInfoId(8);

        if (DoesBlipExist(waypoint)) {
            const waypointCoords = GetBlipInfoIdCoord(waypoint);

            TaskVehicleDriveToCoord(
                PlayerPedId(),
                vehicle,
                waypointCoords[0],
                waypointCoords[1],
                waypointCoords[2],
                30.0,
                1.0,
                GetHashKey(vehicle.toString()),
                786603,
                1.0,
                1
            );
        } else {
            this.notifier.notify(`Vous n'avez pas sélectionné de destination.`, 'error');
        }
    }

    @OnNuiEvent(NuiEvent.AdminSetGodMode)
    public async setGodMode(value: boolean): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_SET_GOD_MODE, value);

        if (value) {
            TriggerServerEvent(ServerEvent.LSMC_SET_CURRENT_DISEASE, 'false', GetPlayerServerId(PlayerId()));
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuGameMasterUncuff)
    public async unCuff(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_UNCUFF_PLAYER);
    }

    @OnNuiEvent(NuiEvent.AdminSetAdminGPS)
    public async setAdminGPS(value: boolean): Promise<void> {
        this.hudMinimapProvider.hasAdminGps = value;
    }

    @OnNuiEvent(NuiEvent.AdminSetPoliceLocator)
    public async setAdminPoliceLocator(value: boolean): Promise<void> {
        this.vehiclePoliceLocator.setAdminEnabled(value);
    }
}
