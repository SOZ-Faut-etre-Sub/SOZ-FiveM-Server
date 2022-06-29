import 'reflect-metadata';
import './globals';

import { PlayerModule } from './client/player/player.module';
import { WeatherModule } from './client/weather/weather.module';
import { Application } from './core/application';
import { unloadContainer } from './core/container';
import { ProviderClientLoader } from './core/loader/provider.client.loader';

async function bootstrap() {
    const app = await Application.create(ProviderClientLoader, PlayerModule, WeatherModule);

    await app.stop();
    unloadContainer();
}

bootstrap();
