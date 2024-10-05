import { Module } from '../../core/decorators/module';
import { FeatureProvider } from './feature.provider';

@Module({
    providers: [FeatureProvider],
})
export class FeatureModule {}
