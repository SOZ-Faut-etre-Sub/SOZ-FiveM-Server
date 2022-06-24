import 'reflect-metadata';

import { Application } from './core/application';
import { unloadContainer } from './core/container';

async function bootstrap() {
    const app = Application.create();

    await app.stop();
    unloadContainer();
}

bootstrap();
