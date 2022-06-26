import { PrismaClient } from '@prisma/client';

import { Once } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';

@Provider()
export class PrismaService extends PrismaClient {
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
    }
}
