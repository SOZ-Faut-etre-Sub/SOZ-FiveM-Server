import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleStateProvider {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Tick(200)
    public updateVehicleState(): void {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicle);

        if (owner !== PlayerId()) {
            return;
        }

        const state = this.vehicleService.getVehicleState(vehicle);

        if (state.speedLimit > 0) {
            const currentSpeed = GetEntitySpeed(vehicle) * 3.6;
            const speedLimit = Math.max(state.speedLimit, currentSpeed - 5);

            SetVehicleMaxSpeed(vehicle, speedLimit / 3.6 - 0.25);
        } else {
            const maxSpeed = GetVehicleHandlingFloat(vehicle, 'CHandlingData', 'fInitialDriveMaxFlatVel');
            SetVehicleMaxSpeed(vehicle, maxSpeed);

            const passengerCount = Math.max(0, GetVehicleNumberOfPassengers(vehicle) - 1);
            ModifyVehicleTopSpeed(vehicle, 1 - passengerCount * 0.02);
        }
    }
}
