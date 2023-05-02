import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import {
    isVehicleModelElectric,
    VehicleClass,
    VehicleLightState,
    VehicleLockStatus,
} from '../../shared/vehicle/vehicle';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { VehicleSeatbeltProvider } from '../vehicle/vehicle.seatbelt.provider';
import { VehicleService } from '../vehicle/vehicle.service';

@Provider()
export class HudVehicleProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(VehicleService)
    private readonly vehicleService: VehicleService;

    @Inject(VehicleSeatbeltProvider)
    private readonly vehicleSeatbeltProvider: VehicleSeatbeltProvider;

    @Tick(0)
    async updateVehicleHud() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        let seat = null;

        if (!vehicle || IsThisModelABicycle(GetEntityModel(vehicle))) {
            this.nuiDispatch.dispatch('hud', 'UpdateVehicle', {
                seat,
            });

            return;
        }

        const ped = PlayerPedId();

        // Get seat for ped
        for (let i = -1; i < GetVehicleMaxNumberOfPassengers(vehicle) - 1; i++) {
            if (GetPedInVehicleSeat(vehicle, i) === ped) {
                seat = i;
                break;
            }
        }

        const [hasLight, lightOn, hasHighBeam] = GetVehicleLightsState(vehicle);
        const hash = GetEntityModel(vehicle);
        const vehicleClass = GetVehicleClass(vehicle) as VehicleClass;
        const speed = GetEntitySpeed(vehicle) * 3.6;
        const state = this.vehicleService.getVehicleState(vehicle);
        const rpm = GetVehicleCurrentRpm(vehicle);
        const fuelType =
            vehicleClass < 23 && vehicleClass != 13 ? (isVehicleModelElectric(hash) ? 'electric' : 'essence') : 'none';

        this.nuiDispatch.dispatch('hud', 'UpdateVehicle', {
            seat,
            fuelType,
            speed,
            rpm,
            fuelLevel: state.condition.fuelLevel,
            engineHealth: GetVehicleEngineHealth(vehicle),
            seatbelt:
                vehicleClass !== VehicleClass.Motorcycles &&
                vehicleClass !== VehicleClass.Cycles &&
                vehicleClass !== VehicleClass.Boats
                    ? this.vehicleSeatbeltProvider.isSeatbeltOnForPlayer()
                    : null,
            oilLevel: state.condition.oilLevel,
            lockStatus: state.open ? VehicleLockStatus.Unlocked : VehicleLockStatus.Locked,
            lightState: hasLight
                ? hasHighBeam
                    ? VehicleLightState.HighBeam
                    : lightOn
                    ? VehicleLightState.LowBeam
                    : VehicleLightState.Off
                : VehicleLightState.Off,
        });
    }
}
