import 'reflect-metadata';

import { Application } from './core/application';
import { unloadContainer } from './core/container';
import { ProviderServerLoader } from './core/loader/provider.server.loader';
import { AdminModule } from './server/admin/admin.module';
import { DatabaseModule } from './server/database/database.module';
import { ItemModule } from './server/item/item.module';
import { BaunModule } from './server/job/baun/baun.module';
import { FightForStyleModule } from './server/job/ffs/ffs.module';
import { FoodModule } from './server/job/food/food.module';
import { LSMCModule } from './server/job/lsmc/lsmc.module';
import { PlayerModule } from './server/player/player.module';
import { StreamModule } from './server/stream/stream.module';
import { VehicleModule } from './server/vehicle/vehicle.module';
import { VoipModule } from './server/voip/voip.module';
import { WeatherModule } from './server/weather/weather.module';
import { ZEventModule } from './server/zevent/zevent.module';

async function bootstrap() {
    const app = await Application.create(
        ProviderServerLoader,
        DatabaseModule,
        WeatherModule,
        PlayerModule,
        ItemModule,
        LSMCModule,
        FightForStyleModule,
        VehicleModule,
        FoodModule,
        BaunModule,
        StreamModule,
        ZEventModule,
        AdminModule,
        VoipModule
    );

    await app.stop();
    unloadContainer();
}

bootstrap();
