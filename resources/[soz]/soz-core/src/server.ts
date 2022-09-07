import 'reflect-metadata';

import { Application } from './core/application';
import { unloadContainer } from './core/container';
import { ProviderServerLoader } from './core/loader/provider.server.loader';
import { AfkModule } from './server/afk/afk.module';
import { AdminModule } from './server/admin/admin.module';
import { DatabaseModule } from './server/database/database.module';
import { FieldModule } from './server/farm/field.module';
import { ItemModule } from './server/item/item.module';
import { BaunModule } from './server/job/baun/baun.module';
import { BennysModule } from './server/job/bennys/bennys.module';
import { FightForStyleModule } from './server/job/ffs/ffs.module';
import { FoodModule } from './server/job/food/food.module';
import { JobModule } from './server/job/job.module';
import { LSMCModule } from './server/job/lsmc/lsmc.module';
import { StonkModule } from './server/job/stonk/stonk.module';
import { PlayerModule } from './server/player/player.module';
import { RebootModule } from './server/reboot/reboot.module';
import { ShopModule } from './server/shop/shop.module';
import { StoryModule } from './server/story/story.module';
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
        VoipModule,
        JobModule,
        BennysModule,
        StonkModule,
        FieldModule,
        ShopModule,
        RebootModule,
        StoryModule,
        AfkModule
    );

    await app.stop();

    unloadContainer();
}

bootstrap();
