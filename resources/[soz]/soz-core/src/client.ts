import 'reflect-metadata';
import './globals';

import { PlayerModule } from './client/player/player.module';
import { Application } from './core/application';
import { unloadContainer } from './core/container';

async function bootstrap() {
    const app = Application.create(PlayerModule);

    await app.stop();
    unloadContainer();
}

bootstrap();
