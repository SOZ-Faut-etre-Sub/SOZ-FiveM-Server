import { PrismaClient } from '@prisma/client';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';

@Provider()
export class PrismaService extends PrismaClient {
    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    constructor() {
        super({
            log: ['warn', 'error', 'query', 'info'],
            datasources: {
                db: {
                    url: GetConvar('mysql_connection_string', ''),
                },
            },
        });
    }

    @Once()
    async onStart() {
        await this.$connect();

        this.onceLoader.trigger(OnceStep.DatabaseConnected);
    }
}
