import { PlayerService } from '@public/client/player/player.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { isVehicleModelElectric } from '@public/shared/vehicle/vehicle';

@Provider()
export class UpwVehicleProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    public async changerVehicleBattery(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.UPW_CHANGE_BATTERY, vehicleNetworkId);
    }

    @Once(OnceStep.PlayerLoaded)
    public async onStart() {
        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/car_battery.png',
                label: 'Changer la batterie',
                color: 'upw',
                action: this.changerVehicleBattery.bind(this),
                blackoutGlobal: true,
                blackoutJob: 'upw',
                item: 'lithium_battery',
                canInteract: entity => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (IsEntityDead(entity)) {
                        return false;
                    }

                    if (!isVehicleModelElectric(GetEntityModel(entity))) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Upw;
                },
            },
        ]);
    }
}
