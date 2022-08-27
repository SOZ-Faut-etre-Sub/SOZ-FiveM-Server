import 'reflect-metadata';
import './globals';

import { AnimationModule } from './client/animation/animation.module';
import { BankModule } from './client/bank/bank.module';
import { ItemModule } from './client/item/item.module';
import { FightForStyleModule } from './client/job/ffs/ffs.module';
import { FoodModule } from './client/job/food/food.module';
import { LSMCModule } from './client/job/lsmc/lsmc.module';
import { NuiModule } from './client/nui/nui.module';
import { PlayerModule } from './client/player/player.module';
import { TargetModule } from './client/target/target.module';
import { WeatherModule } from './client/weather/weather.module';
import { Application } from './core/application';
import { unloadContainer } from './core/container';
import { ProviderClientLoader } from './core/loader/provider.client.loader';

async function bootstrap() {
    const app = await Application.create(
        ProviderClientLoader,
        PlayerModule,
        WeatherModule,
        ItemModule,
        LSMCModule,
        AnimationModule,
        NuiModule,
        BankModule,
        FoodModule,
        TargetModule,
        FightForStyleModule
    );

    await app.stop();
    unloadContainer();
}

bootstrap();
