import 'reflect-metadata';

import { TestClientModule } from './client/test.module';
import { Application } from './core/application';
import { unloadContainer } from './core/container';

async function bootstrap() {
    const app = Application.create(TestClientModule);

    await app.stop();
    unloadContainer();
}

bootstrap();
