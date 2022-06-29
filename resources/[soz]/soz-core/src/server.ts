import 'reflect-metadata';

import { Application } from './core/application';
import { unloadContainer } from './core/container';
import { ProviderServerLoader } from './core/loader/provider.server.loader';
import { DatabaseModule } from './server/database/database.module';
import { WeatherModule } from './server/weather/weather.module';

async function bootstrap() {
    const app = await Application.create(ProviderServerLoader, DatabaseModule, WeatherModule);

    await app.stop();
    unloadContainer();
}

bootstrap();
