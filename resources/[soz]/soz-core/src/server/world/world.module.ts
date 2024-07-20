import { Module } from '../../core/decorators/module';
import { EarthquakeProvider } from './earthquake.provider';
import { FireProvider } from './fire.provider';
import { MeteorProvider } from './meteor.provider';
import { OceanProvider } from './ocean.provider';
import { ThunderProvider } from './thunder.provider';
import { TornadoProvider } from './tornado.provider';
import { WorldEventProvider } from './world.event.provider';

@Module({
    providers: [
        MeteorProvider,
        OceanProvider,
        EarthquakeProvider,
        WorldEventProvider,
        ThunderProvider, 
        FireProvider,
        TornadoProvider,
    ],
})
export class WorldModule {}
