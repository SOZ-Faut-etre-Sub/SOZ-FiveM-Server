import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class HuntProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.Halloween)) {
            return;
        }

        this.targetFactory.createForModel(
            ['pumpkin'],
            [
                {
                    label: 'Fouiller',
                    icon: 'fas fa-pumpkin',
                    action: async entity => TriggerServerEvent(ServerEvent.HALLOWEEN2022_HUNT, GetEntityCoords(entity)),
                },
            ]
        );
    }
}
