import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { RpcEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { VehicleCustomProvider } from './vehicle.custom.provider';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleMenuProvider {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(VehicleCustomProvider)
    private vehicleCustomProvider: VehicleCustomProvider;

    @OnNuiEvent<boolean, boolean>(NuiEvent.VehicleSetEngine)
    async setVehicleEngine(engineOn: boolean) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        SetVehicleEngineOn(vehicle, engineOn, false, true);

        return true;
    }

    @OnNuiEvent<null | number, boolean>(NuiEvent.VehicleSetSpeedLimit)
    async setVehicleSpeedLimit(speedLimit: null | number) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        this.vehicleService.updateVehicleState(vehicle, { speedLimit });

        return true;
    }

    @OnNuiEvent(NuiEvent.VehicleSetDoorOpen)
    async setVehicleDoorState({ doorIndex, open }: { doorIndex: number; open: boolean }) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        if (open) {
            SetVehicleDoorOpen(vehicle, doorIndex, false, false);
        } else {
            SetVehicleDoorShut(vehicle, doorIndex, false);
        }

        return true;
    }

    @OnNuiEvent(NuiEvent.VehicleHandleRadio)
    async handleVehicleRadio() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        TriggerEvent('talk:cibi:use');

        this.nuiMenu.closeMenu();

        return true;
    }

    @OnNuiEvent(NuiEvent.VehicleOpenLSCustom)
    async handleVehicleLSCustom() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        this.nuiMenu.closeMenu();

        await this.vehicleCustomProvider.upgradeVehicle(vehicle);

        return true;
    }

    @Tick(TickInterval.EVERY_SECOND)
    public checkCloseMenu(): void {
        if (this.nuiMenu.getOpened() !== MenuType.Vehicle) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (vehicle) {
            return;
        }

        this.nuiMenu.closeMenu();
    }

    @Command('soz_vehicle_toggle_menu', {
        description: 'Ouvrir le menu du véhicule.',
        keys: [
            {
                mapper: 'keyboard',
                key: 'HOME',
            },
        ],
    })
    async openMenu() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        const isDriver = GetPedInVehicleSeat(vehicle, -1) === ped;
        const isCopilot = GetPedInVehicleSeat(vehicle, 0) === ped;

        if (!isDriver && !isCopilot) {
            return;
        }

        const vehicleState = this.vehicleService.getVehicleState(vehicle);
        const hasRadio = Entity(vehicle).state.hasRadio || false;

        if (isCopilot && !hasRadio) {
            return;
        }

        if (this.nuiMenu.getOpened() === MenuType.Vehicle) {
            this.nuiMenu.closeMenu();

            return;
        }

        const [isAllowed, permission] = await emitRpc<[boolean, string]>(RpcEvent.ADMIN_IS_ALLOWED);
        const doorStatus = {};

        for (let i = 0; i < 6; i++) {
            doorStatus[i] = GetVehicleDoorAngleRatio(vehicle, i) >= 0.5;
        }

        this.nuiMenu.openMenu<MenuType.Vehicle>(MenuType.Vehicle, {
            isDriver,
            engineOn: GetIsVehicleEngineRunning(vehicle),
            speedLimit: vehicleState.speedLimit,
            doorStatus,
            hasRadio,
            insideLSCustom: this.vehicleCustomProvider.isPedInsideCustomZone(),
            permission: isAllowed ? permission : null,
        });
    }
}
