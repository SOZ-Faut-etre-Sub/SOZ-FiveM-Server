import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class ZEventPopcornProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.targetFactory.createForBoxZone(
            'zvent_popcorn',
            {
                center: [339.55, 187.84, 103.0],
                length: 0.4,
                width: 0.65,
                minZ: 103.0,
                maxZ: 103.4,
                heading: 340,
            },
            [
                {
                    label: 'Prendre du pop-corn',
                    icon: 'c:/zevent/popcorn.png',
                    action: () => {
                        TriggerServerEvent(ServerEvent.ZEVENT_GET_POPCORN);
                    },
                },
            ]
        );
    }
}
