import { Module } from '../../core/decorators/module';
import { BlipFactory } from '../blip';
import { EarthquakeProvider } from './earthquake.provider';
import { FireFiretruckProvider } from './fire.firetruck.provider';
import { FireProvider } from './fire.provider';
import { FirestormProvider } from './firestorm.provider';
import { FireworkProvider } from './firework.provider';
import { MeteorProvider } from './meteor.provider';
import { ModelSwapProvider } from './modelswap.provider';
import { OceanProvider } from './ocean.provider';
import { SpotlightProvider } from './spotlight.provider';
import { ThunderProvider } from './thunder.provider';
import { TornadoProvider } from './tornado.provider';
import { WhatIf1Provider } from './whatif.1.provider';
import { WhatIf2Provider } from './whatif.2.provider';
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
        WhatIf1Provider,
        WhatIf2Provider,
        TornadoProvider,
        ThunderProvider,
        FireProvider,
        FirestormProvider,
        ModelSwapProvider,
        FireFiretruckProvider,
    ],
})
export class WorldModule {}
