import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class FightForStyleHarvestProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.targetFactory.createForBoxZone(
            'ffs_harvest_zone',
            {
                center: [2565.04, 4679.64, 34.08],
                length: 1.4,
                width: 0.8,
                minZ: 33.08,
                maxZ: 35.28,
                heading: 313,
            },
            [
                {
                    label: 'Récolter',
                    icon: 'c:/ffs/harvest.png',
                    color: 'ffs',
                    job: 'ffs',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    action: () => {
                        TriggerServerEvent(ServerEvent.FFS_HARVEST);
                    },
                },
            ]
        );
    }
}
