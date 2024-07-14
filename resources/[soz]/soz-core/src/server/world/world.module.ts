import { Module } from '../../core/decorators/module';
import { EarthquakeProvider } from './earthquake.provider';
import { MeteorProvider } from './meteor.provider';
import { OceanProvider } from './ocean.provider';
@Module({
    providers: [MeteorProvider, OceanProvider, EarthquakeProvider],
})
export class WorldModule {}
