import 'reflect-metadata';

import { Application } from './core/application';
import { unloadContainer } from './core/container';
import { ProviderServerLoader } from './core/loader/provider.server.loader';
import { DatabaseModule } from './server/database/database.module';
import { PlayerModule } from './server/player/player.module';
import { WeatherModule } from './server/weather/weather.module';

async function bootstrap() {
    const app = await Application.create(ProviderServerLoader, DatabaseModule, WeatherModule, PlayerModule);

    await app.stop();
    unloadContainer();
}

bootstrap();
