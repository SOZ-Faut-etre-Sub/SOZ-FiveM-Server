import { Module } from '../../core/decorators/module';
import { BlipFactory } from '../blip';
import { EarthquakeProvider } from './earthquake.provider';
import { MeteorProvider } from './meteor.provider';
import { OceanProvider } from './ocean.provider';
@Module({
    providers: [BlipFactory, MeteorProvider, OceanProvider, EarthquakeProvider],
})
export class WorldModule {}
