import { OnEvent } from '@public/core/decorators/event';
import { ClientEvent } from '@public/shared/event';

import { Provider } from '../../core/decorators/provider';

@Provider()
export class VehicleKersProvider {
    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
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
