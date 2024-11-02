import { JobType } from '@public/shared/job';

import { Once } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { Feature } from '../../../shared/features';
import { FeatureProvider } from '../../feature/feature.provider';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class UpwHalloweenProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Once()
    public onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            return;
        }

        this.targetFactory.createForModel('prop_storagetank_06', [
            {
                label: "Un filet d'eau lumineux s'échappe de la cuve...",
                job: JobType.Upw,
                category: 'society',
                action: () => {
                    TriggerServerEvent(ServerEvent.UPW_GET_BLESSED_WATER);
                },
            },
        ]);
    }
}
