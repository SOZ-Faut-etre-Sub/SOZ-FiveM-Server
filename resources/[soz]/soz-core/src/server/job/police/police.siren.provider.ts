import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { RpcServerEvent } from '../../../shared/rpc';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

@Provider()
export class PoliceSirenProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Rpc(RpcServerEvent.VEHICLE_GET_MUTED_SIRENS)
    async getMutedSirens(source: number, vehicles: number[]): Promise<{ vehicle: number; isSirenMuted: boolean }[]> {
        const muted = [];

        for (const vehicle of vehicles) {
            const state = this.vehicleStateService.getVehicleState(vehicle);

            muted.push({ vehicle, isSirenMuted: state.volatile.isSirenMuted });
        }

        return muted;
    }
}
