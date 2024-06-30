import { NodeClickHouseClient } from '@clickhouse/client/dist/client';
import { NodeConfigImpl } from '@clickhouse/client/dist/config';
import { ClickHouseLogLevel } from '@clickhouse/client-common';
import { Injectable } from '@core/decorators/injectable';

@Injectable()
export class ClickhouseService extends NodeClickHouseClient {
    constructor() {
        super({
            impl: NodeConfigImpl,
            database: 'soz',
            url: GetConvar('clickhouse_connection_string', ''),
            log: {
                level: ClickHouseLogLevel.DEBUG,
            },
            clickhouse_settings: {
                async_insert: 1,
                wait_for_async_insert: 1,
            },
        });
    }
}
