import { Module } from '../../core/decorators/module';
import { EarthquakeProvider } from './earthquake.provider';
import { MeteorProvider } from './meteor.provider';
import { OceanProvider } from './ocean.provider';
import { WorldEventProvider } from './world.event.provider';

@Module({
    providers: [MeteorProvider, OceanProvider, EarthquakeProvider, WorldEventProvider],
})
export class WorldModule {}
