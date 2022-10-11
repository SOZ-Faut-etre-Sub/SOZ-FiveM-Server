import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { VehicleEntityState } from '../../shared/vehicle';
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

        const vehicleState = Entity(vehicle).state as VehicleEntityState;
        const vehicleId = vehicleState.id || null;

        // Not a player vehicle
        if (!vehicleId) {
            if (!Entity(vehicle).state.forced && !player.metadata.godmode) {
                SetVehicleDoorsLocked(vehicle, 2);
            } else {
                SetVehicleDoorsLocked(vehicle, 0);
            }
        } else {
            if (Entity(vehicle).state.open) {
                SetVehicleDoorsLocked(vehicle, 0);
            } else {
                // Check if player is owner
            }
        }
    }
}
