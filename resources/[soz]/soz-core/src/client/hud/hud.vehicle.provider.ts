import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import {
    isVehicleModelElectric,
    VehicleClass,
    VehicleLightState,
    VehicleLockStatus,
    VehicleSeat,
} from '../../shared/vehicle/vehicle';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { VehicleConditionProvider } from '../vehicle/vehicle.condition.provider';
import { VehicleSeatbeltProvider } from '../vehicle/vehicle.seatbelt.provider';
import { VehicleStateService } from '../vehicle/vehicle.state.service';

@Provider()
export class HudVehicleProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(VehicleSeatbeltProvider)
    private readonly vehicleSeatbeltProvider: VehicleSeatbeltProvider;

    @Inject(VehicleConditionProvider)
    private readonly vehicleConditionProvider: VehicleConditionProvider;

    @Tick(0)
    async updateVehicleHudSpeed() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (!vehicle) {
            return;
        }

        const speed = GetEntitySpeed(vehicle) * 3.6;
        const rpm = GetVehicleCurrentRpm(vehicle);

        this.nuiDispatch.dispatch('hud', 'UpdateVehicleSpeed', {
            speed,
            rpm,
        });
    }

    @Tick(200)
    async updateVehicleHud() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        let seat = null;

        if (!vehicle) {
            this.nuiDispatch.dispatch('hud', 'UpdateVehicle', {
                seat,
            });

            return;
        }

        const ped = PlayerPedId();

        // Get seat for ped
        for (let i = -1; i < GetVehicleMaxNumberOfPassengers(vehicle); i++) {
            if (GetPedInVehicleSeat(vehicle, i) === ped) {
                seat = i;
                break;
            }
        }

        const vehicleClass = GetVehicleClass(vehicle) as VehicleClass;

        if (seat !== VehicleSeat.Driver) {
            this.nuiDispatch.dispatch('hud', 'UpdateVehicle', {
                seat,
                seatbelt:
                    vehicleClass !== VehicleClass.Motorcycles &&
                    vehicleClass !== VehicleClass.Cycles &&
                    vehicleClass !== VehicleClass.Boats
                        ? this.vehicleSeatbeltProvider.isSeatbeltOnForPlayer()
                        : null,
            });

            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);
        const condition = this.vehicleConditionProvider.getVehicleCondition(vehicleNetworkId);

        if (null === condition) {
            this.nuiDispatch.dispatch('hud', 'UpdateVehicle', {
                seat,
                seatbelt:
                    vehicleClass !== VehicleClass.Motorcycles &&
                    vehicleClass !== VehicleClass.Cycles &&
                    vehicleClass !== VehicleClass.Boats
                        ? this.vehicleSeatbeltProvider.isSeatbeltOnForPlayer()
                        : null,
            });

            return;
        }

        const model = GetEntityModel(vehicle);
        const useRpm = !IsThisModelAHeli(model) && !IsThisModelAPlane(model);
        const [hasLight, lightOn, hasHighBeam] = GetVehicleLightsState(vehicle);
        const hash = GetEntityModel(vehicle);
        const fuelType =
            vehicleClass < 23 && vehicleClass != 13 ? (isVehicleModelElectric(hash) ? 'electric' : 'essence') : 'none';

        this.nuiDispatch.dispatch('hud', 'UpdateVehicle', {
            seat,
            fuelType,
            fuelLevel: condition.fuelLevel,
            engineHealth: GetVehicleEngineHealth(vehicle),
            seatbelt:
                vehicleClass !== VehicleClass.Motorcycles &&
                vehicleClass !== VehicleClass.Cycles &&
                vehicleClass !== VehicleClass.Boats
                    ? this.vehicleSeatbeltProvider.isSeatbeltOnForPlayer()
                    : null,
            oilLevel: condition.oilLevel,
            lockStatus: GetVehicleDoorLockStatus(vehicle) as VehicleLockStatus,
            useRpm,
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
