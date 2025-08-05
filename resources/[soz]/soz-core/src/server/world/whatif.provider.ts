import { Feature } from '@public/shared/features';

import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { FeatureProvider } from '../feature/feature.provider';

@Provider()
export class WhatIfProvider {
    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

    @On('entityCreating', false)
    public onEntityCreating(handle: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        if (GetEntityType(handle) !== 1) {
            CancelEvent();
        }
    }
}
