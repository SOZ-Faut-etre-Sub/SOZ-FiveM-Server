import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { Once } from '@public/core/decorators/event';

import { VehicleSeat, VehicleVolatileState } from '../../shared/vehicle/vehicle';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleTopSpeedProvider {
    @Inject(VehicleService)
    vehicleService: VehicleService;

    @Once()
    init() {
        //SetEnableVehicleSlipstreaming(true);
    }

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

        let topSpeedModifier = 0;
        const wheelCount = Math.min(GetVehicleNumberOfWheels(vehicle), 6);
        if (wheelCount > 0 && count > 0) {
            topSpeedModifier = -Math.min(80, (80 / (wheelCount * 2)) * count);
        }

        ModifyVehicleTopSpeed(vehicle, topSpeedModifier);
    }
}
