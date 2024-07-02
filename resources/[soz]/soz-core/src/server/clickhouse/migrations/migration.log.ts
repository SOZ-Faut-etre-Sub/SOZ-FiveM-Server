import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationLog implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                CREATE TABLE IF NOT EXISTS logs
                (
                    level LowCardinality(String),
                    message String,
                    timestamp DateTime64 DEFAULT now64(),
                    origin LowCardinality(String),
                    citizen_id Nullable(String),
                    player_name Nullable(String),
                    player_job LowCardinality(Nullable(String)),
                    player_source Nullable(Int64),
                    player_on_duty Nullable(Boolean)
                )
                ENGINE = MergeTree()
                ORDER BY (timestamp)
                PARTITION BY (toYYYYMM(timestamp))
            `,
        });
    }

    get name(): string {
        return 'add_log_table';
    }

    get priority(): number {
        return 0;
    }
}
