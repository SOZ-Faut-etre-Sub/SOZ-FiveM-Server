import { Command } from '@core/decorators/command';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';

import { DefaultFeatureConfig, Environment, Feature, FeaturesConfig } from '../../shared/features';
import { Notifier } from '../notifier';
import { StateSelector, Store } from '../store/store';

@Provider()
export class FeatureProvider {
    @Inject('Store')
    private store: Store;

    @Inject(Notifier)
    private notifier: Notifier;

    private features: FeaturesConfig = DefaultFeatureConfig;
    private environment = GetConvar('soz_core_environment', 'development') as Environment;

    @StateSelector(state => state.global.features)
    async onFeaturesChange(features: FeaturesConfig) {
        this.features = features;
    }

    public isFeatureEnabled(feature: keyof FeaturesConfig) {
        if (!this.features || !this.features[feature]) {
            return false;
        }

        return !!this.features[feature][this.environment];
    }

    @Command('feature', { description: 'Enable or disable some features', role: 'admin' })
    setFeature(source: number, action: 'enable' | 'disable', feature: Feature): void {
        const features = this.store.getState().global.features;

        this.store.dispatch.global.update({
            features: { ...features, [feature]: { ...features[feature], [this.environment]: action === 'enable' } },
        });
        this.notifier.notify(
            source,
            `${feature} est maintenant ${action === 'enable' ? 'activé' : 'désactivé'}~n~⚠️ Au redémarrage du serveur, la fonctionnalité sera réinitialisée`,
            'info'
        );
    }
}
