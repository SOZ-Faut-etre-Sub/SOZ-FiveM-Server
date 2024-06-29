import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';

import { VehicleSeat, VehicleVolatileState } from '../../shared/vehicle/vehicle';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleTopSpeedProvider {
    @Inject(VehicleService)
    vehicleService: VehicleService;

    @Tick(TickInterval.EVERY_SECOND)
    updateTopSpeed() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);
        if (!ped || !vehicle) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) !== ped) {
            return;
        }

        const vehicleCondition = this.vehicleService.getPartialClientVehiculeCondition(
            vehicle,
            {} as VehicleVolatileState,
            ['tireBurstState', 'tireBurstCompletely']
        );

        let count = 0;
        for (const bool of Object.values(vehicleCondition['tireBurstState'])) {
            if (bool) {
                count++;
            }
        }
        for (const bool of Object.values(vehicleCondition['tireBurstCompletely'])) {
            if (bool) {
                count++;
            }
        }

        const passengerCount = Math.max(0, GetVehicleNumberOfPassengers(vehicle) - 1);
        const wheelCount = Math.min(GetVehicleNumberOfWheels(vehicle), 6);
        const topSpeedModifier = passengerCount * 2 + Math.min(80, (80 / (wheelCount * 2)) * count);

        ModifyVehicleTopSpeed(vehicle, -topSpeedModifier);
    }
}
