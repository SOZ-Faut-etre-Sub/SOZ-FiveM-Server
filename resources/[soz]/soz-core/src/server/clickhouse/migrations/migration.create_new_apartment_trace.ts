import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationCreateNewApartmentTrace implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                ALTER TABLE soz.trace_events ADD COLUMN money_tier Nullable(Int64), ADD COLUMN  park_tier Nullable(Int64), cloth_tier Nullable(Int64), ADD COLUMN apartment_shell Nullable(Boolean);
            `,
        });
    }

    get name(): string {
        return 'create_new_apartment_trace';
    }

    get priority(): number {
        return -12;
    }
}
