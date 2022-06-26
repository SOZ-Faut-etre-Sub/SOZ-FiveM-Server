import 'reflect-metadata';

import { Application } from './core/application';
import { unloadContainer } from './core/container';
import { DatabaseModule } from './server/database/database.module';

async function bootstrap() {
    const app = Application.create(DatabaseModule);

    await app.stop();
    unloadContainer();
}

bootstrap();
