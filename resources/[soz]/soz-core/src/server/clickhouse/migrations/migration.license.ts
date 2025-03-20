import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationLicense implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                ALTER TABLE soz.trace_events ADD COLUMN license Nullable(String), ADD COLUMN license2 Nullable(String);
            `,
        });
    }

    get name(): string {
        return 'license';
    }

    get priority(): number {
        return -18;
    }
}
