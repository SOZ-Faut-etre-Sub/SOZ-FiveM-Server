import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class BaunResellProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.targetFactory.createForBoxZone(
            'baun_resell',
            {
                center: [398.43, 175.61, 103.86],
                length: 3.0,
                width: 0.4,
                minZ: 102.86,
                maxZ: 105.36,
                heading: 340,
            },
            [
                {
                    label: 'Vendre',
                    icon: 'c:/baun/sell.png',
                    color: 'baun',
                    job: 'baun',
                    item: 'cocktail_box',
                    blackoutGlobal: true,
                    blackoutJob: 'baun',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    action: () => {
                        TriggerServerEvent(ServerEvent.BAUN_RESELL);
                    },
                },
            ]
        );
    }
}
