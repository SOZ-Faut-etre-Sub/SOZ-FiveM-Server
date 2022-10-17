import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleFuelProvider {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Tick(TickInterval.EVERY_SECOND)
    private async onTick() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (!IsVehicleEngineOn(vehicle)) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicle);

        if (owner !== PlayerId()) {
            return;
        }

        const rpm = Math.pow(GetVehicleCurrentRpm(vehicle), 1.5);
        let consumedFuel = 0.0;

        consumedFuel += rpm * 0.0005;
        consumedFuel += GetVehicleAcceleration(vehicle) * 0.0002;
        consumedFuel += GetVehicleMaxTraction(vehicle) * 0.0001;

        const consumedOil = consumedFuel / 280;
        const state = this.vehicleService.getVehicleState(vehicle);

        const newOil = Math.max(0, state.condition.oilLevel - consumedOil);
        const newFuel = Math.max(0, state.condition.fuelLevel - consumedFuel);

        this.vehicleService.updateVehicleState(vehicle, {
            condition: {
                ...state.condition,
                oilLevel: newOil,
                fuelLevel: newFuel,
            },
        });

        SetVehicleOilLevel(vehicle, newOil);
        SetVehicleFuelLevel(vehicle, newFuel);

        if (newOil <= 0.1) {
            const newEngineHealth = Math.max(0, GetVehicleEngineHealth(vehicle) - 50);
            SetVehicleEngineHealth(vehicle, newEngineHealth);
            SetVehicleEngineOn(vehicle, false, true, true);
        }
    }
}
