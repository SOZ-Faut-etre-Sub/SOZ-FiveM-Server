import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationUpdateHeist implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                ALTER TABLE soz.trace_events ADD COLUMN success Nullable(Boolean);
            `,
        });
    }

    get name(): string {
        return 'update_heist';
    }

    get priority(): number {
        return -11;
    }
}
