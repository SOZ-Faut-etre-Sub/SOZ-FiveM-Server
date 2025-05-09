import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { Control } from '@public/shared/input';

import { PlayerService } from '../player/player.service';
import { RaceProvider } from '../race/race.provider';

const f1 = GetHashKey('openwheel1');

@Provider()
export class VehicleF1Provider {
    @Inject(RaceProvider)
    private raceProvider: RaceProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Tick()
    onF1Check() {
        if (this.raceProvider.isInRace()) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (GetEntityModel(vehicle) !== f1) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (['admin', 'staff'].includes(player.role)) {
            return;
        }

        if (GetCamViewModeForContext(1) != 4) {
            SetCamViewModeForContext(1, 4);
        }

        DisableControlAction(0, Control.NextCamera, true);
    }
}
