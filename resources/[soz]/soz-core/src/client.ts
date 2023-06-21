import 'reflect-metadata';
import './globals';

import { modules as PrivateModules } from '@private/client/modules';

import { AdminModule } from './client/admin/admin.module';
import { AfkModule } from './client/afk/afk.module';
import { AnimationModule } from './client/animation/animation.module';
import { BankModule } from './client/bank/bank.module';
import { BinocularsModule } from './client/binoculars/binoculars.module';
import { DrivingSchoolModule } from './client/driving-school/ds.module';
import { FactoryModule } from './client/factory/factory.module';
import { HousingModule } from './client/housing/housing.module';
import { HudModule } from './client/hud/hud.module';
import { InventoryModule } from './client/inventory/inventory.module';
import { ItemModule } from './client/item/item.module';
import { BaunModule } from './client/job/baun/baun.module';
import { BennysModule } from './client/job/bennys/bennys.module';
import { FightForStyleModule } from './client/job/ffs/ffs.module';
import { FoodModule } from './client/job/food/food.module';
import { JobModule } from './client/job/job.module';
import { LSMCModule } from './client/job/lsmc/lsmc.module';
import { MandatoryModule } from './client/job/mdr/mdr.module';
import { OilModule } from './client/job/oil/oil.module';
import { PoliceModule } from './client/job/police/police.module';
import { StonkModule } from './client/job/stonk/stonk.module';
import { TaxiModule } from './client/job/taxi/taxi.module';
import { UpwModule } from './client/job/upw/upw.module';
import { MonitorModule } from './client/monitor/monitor.module';
import { NuiModule } from './client/nui/nui.module';
import { ObjectModule } from './client/object/object.module';
import { PlayerModule } from './client/player/player.module';
import { RepositoryModule } from './client/resources/repository.module';
import { ShopModule } from './client/shop/shop.module';
import { store } from './client/store/store';
import { StoreModule } from './client/store/store.module';
import { StoryModule } from './client/story/story.module';
import { StreamModule } from './client/stream/stream.module';
import { TargetModule } from './client/target/target.module';
import { VehicleModule } from './client/vehicle/vehicle.module';
import { VoipModule } from './client/voip/voip.module';
import { WeaponModule } from './client/weapon/weapon.module';
import { WeatherModule } from './client/weather/weather.module';
import { WorldModule } from './client/world/world.module';
import { ZEventModule } from './client/zevent/zevent.module';
import { Application } from './core/application';
import { setService, setServiceInstance, unloadContainer } from './core/container';
import { ProviderClientLoader } from './core/loader/provider.client.loader';
import { ChainMiddlewareEventClientFactory } from './core/middleware/middleware.event.client';
import { ChainMiddlewareTickClientFactory } from './core/middleware/middleware.tick.client';

async function bootstrap() {
    setServiceInstance('Store', store);
    setService('MiddlewareFactory', ChainMiddlewareEventClientFactory);
    setService('MiddlewareTickFactory', ChainMiddlewareTickClientFactory);

    const app = await Application.create(
        ProviderClientLoader,
        StoreModule,
        RepositoryModule,
        MonitorModule,
        HudModule,
        WorldModule,
        ObjectModule,
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
        InventoryModule,
        DrivingSchoolModule,
        HousingModule,
        MandatoryModule,
        PoliceModule,
        UpwModule,
        TaxiModule,
        BinocularsModule,
        VoipModule,
        ...PrivateModules
    );

    await app.stop();
    unloadContainer();
}

bootstrap();
