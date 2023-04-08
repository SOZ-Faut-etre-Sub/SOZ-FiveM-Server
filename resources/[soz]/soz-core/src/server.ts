import 'reflect-metadata';

import { modules as PrivateModules } from '@private/server/modules';

import { Application } from './core/application';
import { unloadContainer } from './core/container';
import { ProviderServerLoader } from './core/loader/provider.server.loader';
import { AdminModule } from './server/admin/admin.module';
import { AfkModule } from './server/afk/afk.module';
import { DatabaseModule } from './server/database/database.module';
import { DrivingSchoolModule } from './server/driving-school/ds.module';
import { FieldModule } from './server/farm/field.module';
import { InventoryModule } from './server/inventory/inventory.module';
import { ItemModule } from './server/item/item.module';
import { BaunModule } from './server/job/baun/baun.module';
import { BennysModule } from './server/job/bennys/bennys.module';
import { FightForStyleModule } from './server/job/ffs/ffs.module';
import { FoodModule } from './server/job/food/food.module';
import { JobModule } from './server/job/job.module';
import { LSMCModule } from './server/job/lsmc/lsmc.module';
import { MdrModule } from './server/job/mdr/mdr.module';
import { OilModule } from './server/job/oil/oil.module';
import { PoliceModule } from './server/job/police/police.module';
import { StonkModule } from './server/job/stonk/stonk.module';
import { UpwModule } from './server/job/upw/upw.module';
import { PlayerModule } from './server/player/player.module';
import { RebootModule } from './server/reboot/reboot.module';
import { RepositoryModule } from './server/repository/repository.module';
import { ShopModule } from './server/shop/shop.module';
import { SoundModule } from './server/sound/sound.module';
import { StoryModule } from './server/story/story.module';
import { StreamModule } from './server/stream/stream.module';
import { VehicleModule } from './server/vehicle/vehicle.module';
import { VoipModule } from './server/voip/voip.module';
import { WeaponModule } from './server/weapon/weapon.module';
import { WeatherModule } from './server/weather/weather.module';
import { ZEventModule } from './server/zevent/zevent.module';

async function bootstrap() {
    const app = await Application.create(
        ProviderServerLoader,
        DatabaseModule,
        RepositoryModule,
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
        AfkModule,
        OilModule,
        WeaponModule,
        InventoryModule,
        DrivingSchoolModule,
        MdrModule,
        SoundModule,
        PoliceModule,
        UpwModule,
        ...PrivateModules
    );

    await app.stop();

    unloadContainer();
}

bootstrap();
