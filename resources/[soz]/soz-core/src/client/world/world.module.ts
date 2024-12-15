import { Module } from '../../core/decorators/module';
import { BlipFactory } from '../blip';
import { EarthquakeProvider } from './earthquake.provider';
import { FireworkProvider } from './firework.provider';
import { MeteorProvider } from './meteor.provider';
import { OceanProvider } from './ocean.provider';
import { SpotlightProvider } from './spotlight.provider';
import { WorldEventProvider } from './world.event.provider';

@Module({
    providers: [
        BlipFactory,
        WorldEventProvider,
        MeteorProvider,
        OceanProvider,
        EarthquakeProvider,
        FireworkProvider,
        SpotlightProvider,
    ],
})
export class WorldModule {}
