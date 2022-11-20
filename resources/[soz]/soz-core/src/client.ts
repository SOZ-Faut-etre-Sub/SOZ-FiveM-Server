import 'reflect-metadata';
import './globals';

import { AdminModule } from './client/admin/admin.module';
import { AfkModule } from './client/afk/afk.module';
import { AnimationModule } from './client/animation/animation.module';
import { BankModule } from './client/bank/bank.module';
import { FactoryModule } from './client/factory/factory.module';
import { InventoryModule } from './client/inventory/inventory.module';
import { ItemModule } from './client/item/item.module';
import { BaunModule } from './client/job/baun/baun.module';
import { BennysModule } from './client/job/bennys/bennys.module';
import { FightForStyleModule } from './client/job/ffs/ffs.module';
import { FoodModule } from './client/job/food/food.module';
import { JobModule } from './client/job/job.module';
import { LSMCModule } from './client/job/lsmc/lsmc.module';
import { OilModule } from './client/job/oil/oil.module';
import { StonkModule } from './client/job/stonk/stonk.module';
import { NuiModule } from './client/nui/nui.module';
import { PlayerModule } from './client/player/player.module';
import { RepositoryModule } from './client/resources/repository.module';
import { ShopModule } from './client/shop/shop.module';
import { StoryModule } from './client/story/story.module';
import { StreamModule } from './client/stream/stream.module';
import { TargetModule } from './client/target/target.module';
import { VehicleModule } from './client/vehicle/vehicle.module';
import { WeaponModule } from './client/weapon/weapon.module';
import { WeatherModule } from './client/weather/weather.module';
import { WorldModule } from './client/world/world.module';
import { ZEventModule } from './client/zevent/zevent.module';
import { Application } from './core/application';
import { unloadContainer } from './core/container';
import { ProviderClientLoader } from './core/loader/provider.client.loader';

async function bootstrap() {
    const app = await Application.create(
        ProviderClientLoader,
        RepositoryModule,
        WorldModule,
        PlayerModule,
        WeatherModule,
        ItemModule,
        LSMCModule,
        AnimationModule,
        NuiModule,
        FoodModule,
        TargetModule,
        FightForStyleModule,
        BaunModule,
        StreamModule,
        ZEventModule,
        AdminModule,
        BennysModule,
        StonkModule,
        BankModule,
        JobModule,
        ShopModule,
        StoryModule,
        AfkModule,
        VehicleModule,
        FactoryModule,
        OilModule,
        WeaponModule,
        InventoryModule
    );

    await app.stop();
    unloadContainer();
}

bootstrap();
