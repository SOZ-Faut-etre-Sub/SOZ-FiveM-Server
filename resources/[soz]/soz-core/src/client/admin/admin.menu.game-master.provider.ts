import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class AdminMenuGameMasterProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private adminGPS = false;

    @OnNuiEvent(NuiEvent.AdminGiveMoney)
    public async giveMoney(amount: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_GIVE_MONEY, 'money', amount);
        this.notifier.notify(`Vous vous êtes donné ${amount}$ en argent propre.`, 'success');
    }

    @OnNuiEvent(NuiEvent.AdminGiveMarkedMoney)
    public async giveMarkedMoney(amount: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_GIVE_MONEY, 'marked_money', amount);
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
        TriggerServerEvent(ServerEvent.ADMIN_GIVE_LICENCE, licence);
    }

    @OnNuiEvent(NuiEvent.AdminToggleMoneyCase)
    public async toggleDisableMoneyCase(value: boolean): Promise<void> {
        LocalPlayer.state.set('adminDisableMoneyCase', !value, false);
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
        TriggerServerEvent(ServerEvent.ADMIN_GOD_MODE, value);
        if (value) {
            TriggerServerEvent(ServerEvent.LSMC_SET_CURRENT_DISEASE, 'false', GetPlayerServerId(PlayerId()));
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuGameMasterUncuff)
    public async unCuff(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_UNCUFF);
    }

    @OnNuiEvent(NuiEvent.AdminMenuGameMasterCreateNewCharacter)
    public async createNewCharacter(): Promise<void> {
        const firstName = await this.inputService.askInput({
            maxCharacters: 30,
            title: 'Prénom',
            defaultValue: '',
        });

        if (!firstName) {
            return;
        }

        await wait(100);

        const lastName = await this.inputService.askInput({
            maxCharacters: 30,
            title: 'Nom',
            defaultValue: '',
        });

        if (!lastName) {
            return;
        }

        this.nuiMenu.closeAll();
        TriggerServerEvent(ServerEvent.ADMIN_CREATE_CHARACTER, firstName, lastName);
    }

    @OnNuiEvent(NuiEvent.AdminMenuGameMasterSwitchCharacter)
    public async switchCharacter(citizenId: string): Promise<void> {
        this.nuiMenu.closeAll();
        TriggerServerEvent(ServerEvent.ADMIN_SWITCH_CHARACTER, citizenId);
    }

    @OnNuiEvent(NuiEvent.AdminSetAdminGPS)
    public async setAdminGPS(value: boolean): Promise<void> {
        this.adminGPS = value;
        TriggerEvent('hud:client:admingps', value);
    }

    public getAdminGPS() {
        return this.adminGPS;
    }
}
