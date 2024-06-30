import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationPlayerPosition implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                CREATE TABLE IF NOT EXISTS player_position
                (
                    citizen_id String,
                    player_name String,
                    player_job LowCardinality(String),
                    vehicle_type LowCardinality(Nullable(String)),
                    vehicle_plate Nullable(String),
                    position Point,
                    z Float64,
                    heading Float64,
                    timestamp DateTime64 DEFAULT now64()
                )
                ENGINE = MergeTree()
                ORDER BY (timestamp)
                PARTITION BY (toYYYYMM(timestamp))
            `,
        });
    }

    get name(): string {
        return 'add_player_position_table';
    }

    get priority(): number {
        return 0;
    }
}
