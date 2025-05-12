import { OnEvent } from '@public/core/decorators/event';
import { ServerEvent } from '@public/shared/event/server';

import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

@Provider()
export class PoliceSirenProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @OnEvent(ServerEvent.VEHICLE_GYRO_REMOVE)
    public async onRemoveGyro(source: number, vehNetId: number) {
        this.vehicleStateService.deleteGyro(vehNetId);

        this.vehicleStateService.updateVehicleVolatileState(vehNetId, {
            gyro: null,
            isSirenMuted: true,
        });
    }
}
