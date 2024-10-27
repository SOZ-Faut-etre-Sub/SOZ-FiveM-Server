import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';

import { DefaultFeatureConfig, Environment, Feature, FeaturesConfig } from '../../shared/features';
import { StateSelector } from '../store/store';

@Provider()
export class FeatureProvider {
    @Inject(NuiDispatch)
    private readonly dispatcher: NuiDispatch;

    private features: FeaturesConfig = DefaultFeatureConfig;
    private environment = GetConvar('soz_core_environment', 'development') as Environment;

    @StateSelector(state => state.global.features)
    async onFeaturesChange(features: FeaturesConfig) {
        if (!features) {
            return;
        }
        this.features = features;
        this.updateNuiFeatures();
    }

    public isFeatureEnabled(feature: keyof FeaturesConfig) {
        if (!this.features || !this.features[feature]) {
            return false;
        }

        return !!this.features[feature][this.environment];
    }

    @Once(OnceStep.NuiLoaded)
    private onNuiLoaded() {
        this.updateNuiFeatures();
    }

    private updateNuiFeatures() {
        const nuiFeaturesEnabled: Record<Feature, boolean> = {} as Record<Feature, boolean>;
        Object.entries(this.features ?? {}).forEach(([feature, value]) => {
            nuiFeaturesEnabled[feature] = value[this.environment];
        });

        this.dispatcher.dispatch('feature', 'Set', nuiFeaturesEnabled);
    }
}
