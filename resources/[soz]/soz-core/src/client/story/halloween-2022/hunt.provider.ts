import { ObjectProvider } from '@public/client/object/object.provider';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature } from '../../../shared/features';
import { FeatureProvider } from '../../feature/feature.provider';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class HuntProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            return;
        }

        this.targetFactory.createForModel(
            ['pumpkin'],
            [
                {
                    label: 'Fouiller',
                    icon: 'global/search',
                    category: 'citizen',
                    action: async entity => TriggerServerEvent(ServerEvent.HALLOWEEN2022_HUNT, GetEntityCoords(entity)),
                    canInteract: entity => !this.objectProvider.getIdFromEntity(entity),
                },
            ]
        );
    }
}
