import { Prisma, PrismaClient } from '@prisma/client';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';
import { SOZ_CORE_IS_PRODUCTION } from '../../globals';

@Provider()
export class PrismaService extends PrismaClient {
    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    constructor() {
        const log: Prisma.LogLevel[] = SOZ_CORE_IS_PRODUCTION ? ['warn', 'error'] : ['warn', 'error', 'query', 'info'];

        super({
            log,
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

        setTimeout(() => this.onceLoader.trigger(OnceStep.DatabaseConnected), 0);
    }

    @Once(OnceStep.Stop)
    async onStop() {
        await this.$disconnect();
    }
}
