import { Module } from '../../core/decorators/module';
import { BlipFactory } from '../blip';
import { EarthquakeProvider } from './earthquake.provider';
import { MeteorProvider } from './meteor.provider';
import { OceanProvider } from './ocean.provider';
import { WorldEventProvider } from './world.event.provider';

@Module({
    providers: [BlipFactory, WorldEventProvider, MeteorProvider, OceanProvider, EarthquakeProvider],
})
export class WorldModule {}
