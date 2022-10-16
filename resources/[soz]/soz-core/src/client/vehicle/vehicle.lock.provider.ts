import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { getVehicleState, VehicleEntityState } from '../../shared/vehicle';
import { PlayerService } from '../player/player.service';

@Provider()
export class VehicleLockProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Tick(TickInterval.EVERY_FRAME)
    private async checkPlayerCanEnterVehicle() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsTryingToEnter(ped);

        if (!vehicle) {
            return;
        }

        const vehicleState = getVehicleState(vehicle);

        if (vehicleState.forced || player.metadata.godmode || vehicleState.open) {
            SetVehicleDoorsLocked(vehicle, 0);
        } else {
            SetVehicleDoorsLocked(vehicle, 2);
        }
    }
}
