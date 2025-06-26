import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationCreateCasinoTrace implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                ALTER TABLE soz.trace_events ADD COLUMN bet Nullable(Int64), ADD COLUMN reward Nullable(Int64);
            `,
        });
    }

    get name(): string {
        return 'create_casino_trace';
    }

    get priority(): number {
        return -11;
    }
}
