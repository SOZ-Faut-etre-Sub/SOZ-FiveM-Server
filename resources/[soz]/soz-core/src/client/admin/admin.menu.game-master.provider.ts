import { OnNuiEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { NuiEvent, ServerEvent } from '../../shared/event';

@Provider()
export class AdminMenuGameMasterProvider {
    @OnNuiEvent(NuiEvent.AdminGiveMoney)
    public async giveMoney(amount: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_GIVE_MONEY, 'money', amount);
    }

    @OnNuiEvent(NuiEvent.AdminGiveMarkedMoney)
    public async giveMarkedMoney(amount: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_GIVE_MONEY, 'marked', amount);
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

    @OnNuiEvent(NuiEvent.AdminSetInvincible)
    public async setInvincible(value: boolean): Promise<void> {
        SetEntityInvincible(PlayerPedId(), value);
    }

    @OnNuiEvent(NuiEvent.AdminSetGodMode)
    public async setGodMode(value: boolean): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_GOD_MODE, value);
        if (value) {
            TriggerEvent(ServerEvent.LSMC_CLEAR_DISEASE);
        }
    }
}
