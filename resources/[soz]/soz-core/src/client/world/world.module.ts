import { Module } from '../../core/decorators/module';
import { WorldEventProvider } from './world.event.provider';
import { EarthquakeProvider } from './earthquake.provider';
import { MeteorProvider } from './meteor.provider';
import { OceanProvider } from './ocean.provider';

@Module({
    providers: [WorldEventProvider, MeteorProvider, OceanProvider, EarthquakeProvider],
})
export class WorldModule {}
