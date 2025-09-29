import { POLICE_MINESWEEPER_ROBOT_CAR_MODEL } from '@private/shared/police';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import {
    getDefaultVehicleCondition,
    getVehicleMaxFuelStorage,
    isVehicleModelElectric,
    VehicleClass,
    VehicleLightState,
    VehicleLockStatus,
    VehicleSeat,
} from '../../shared/vehicle/vehicle';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleConditionProvider } from '../vehicle/vehicle.condition.provider';
import { VehicleSeatbeltProvider } from '../vehicle/vehicle.seatbelt.provider';

@Provider()
export class HudVehicleProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(VehicleSeatbeltProvider)
    private readonly vehicleSeatbeltProvider: VehicleSeatbeltProvider;

    @Inject(VehicleConditionProvider)
    private readonly vehicleConditionProvider: VehicleConditionProvider;

    private nosLevel = 1.0;

    @Tick(0)
    async updateVehicleHudSpeed() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        if (!vehicle) {
            return;
        }

        const isHeli = IsThisModelAHeli(GetEntityModel(vehicle));

        const speed = GetEntitySpeed(vehicle) * 3.6;
        const rpm = GetVehicleDashboardRpm();
        const gear = isHeli ? 1 : GetVehicleCurrentGear(vehicle);

        this.nuiDispatch.dispatch('hud', 'UpdateVehicleSpeed', {
            speed,
            rpm,
            gear,
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

        if (!vehicle || GetEntityModel(vehicle) === GetHashKey(POLICE_MINESWEEPER_ROBOT_CAR_MODEL)) {
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
                    vehicleClass !== VehicleClass.Motorcycles && vehicleClass !== VehicleClass.Cycles
                        ? this.vehicleSeatbeltProvider.isSeatbeltOnForPlayer()
                        : null,
            });

            return;
        }

        const model = GetEntityModel(vehicle);
        const vehDef = this.vehicleRepository.getByModelHash(model);
        const netId = NetworkGetEntityIsNetworked(vehicle) ? NetworkGetNetworkIdFromEntity(vehicle) : 0;
        const condition = netId
            ? this.vehicleConditionProvider.getVehicleCondition(netId)
            : getDefaultVehicleCondition(vehDef);

        if (null === condition) {
            this.nuiDispatch.dispatch('hud', 'UpdateVehicle', {
                seat,
                seatbelt:
                    vehicleClass !== VehicleClass.Motorcycles && vehicleClass !== VehicleClass.Cycles
                        ? this.vehicleSeatbeltProvider.isSeatbeltOnForPlayer()
                        : null,
            });

            return;
        }

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
                vehicleClass !== VehicleClass.Motorcycles && vehicleClass !== VehicleClass.Cycles
                    ? this.vehicleSeatbeltProvider.isSeatbeltOnForPlayer()
                    : null,
            oilLevel: condition.oilLevel,
            lockStatus: GetVehicleDoorLockStatus(vehicle) as VehicleLockStatus,
            maxFuel: getVehicleMaxFuelStorage(vehDef),
            useRpm,
            lightState: hasLight
                ? hasHighBeam
                    ? VehicleLightState.HighBeam
                    : lightOn
                      ? VehicleLightState.LowBeam
                      : VehicleLightState.Off
                : VehicleLightState.Off,
            nosLevel: this.nosLevel,
            nosCount: condition.nitro,
        });
    }

    public setNosLevel(value: number) {
        this.nosLevel = value;
    }
}
