import { Logger } from '@core/logger';
import { Prisma, PrismaClient } from '@prisma/client';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';

@Provider()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn' | 'info'> {
    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(Logger)
    private logger: Logger;

    constructor() {
        super({
            log: [
                { emit: 'event', level: 'warn' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'query' },
            ],
            datasources: {
                db: {
                    url: GetConvar('mysql_connection_string', ''),
                },
            },
        });

        this.$on('query', e => {
            if (e.duration >= 200) {
                this.logger.warn(`[Prisma] [slow query] [${e.duration}ms] ${e.query.trim()} ${e.params} `);
            } else {
                this.logger.debug(`[Prisma] [${e.duration}ms] ${e.query.trim()} ${e.params}`);
            }
        });
        this.$on('error', e => this.logger.error(`[Prisma] [${e.target}] ${e.message}`));
        this.$on('warn', e => this.logger.warn(`[Prisma] [${e.target}] ${e.message}`));
        this.$on('info', e => this.logger.info(`[Prisma] [${e.target}] ${e.message}`));
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
