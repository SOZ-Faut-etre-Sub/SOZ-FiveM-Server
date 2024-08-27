import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationUpdateGang implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                ALTER TABLE soz.trace_events ADD COLUMN gang Nullable(String), ADD COLUMN old_plate Nullable(String);
            `,
        });
    }

    get name(): string {
        return 'update_gang';
    }

    get priority(): number {
        return -11;
    }
}
