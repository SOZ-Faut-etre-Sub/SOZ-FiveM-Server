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
                ALTER TABLE soz.trace_events ADD COLUMN item_slot Nullable(Int64);
            `,
        });
    }

    get name(): string {
        return 'add_item_slot';
    }

    get priority(): number {
        return -12;
    }
}
