import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';

@Provider()
export class VehicleKersProvider {
    @Tick(TickInterval.EVERY_FRAME)
    public disableKers(): void {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, -1) !== ped) {
            return;
        }

        if (GetVehicleHasKers(vehicle)) {
            SetVehicleKersAllowed(vehicle, false);
        }
    }
}
