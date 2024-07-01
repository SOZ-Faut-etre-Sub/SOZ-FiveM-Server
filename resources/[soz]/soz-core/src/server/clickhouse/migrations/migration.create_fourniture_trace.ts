import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationCreateFournitureTrace implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                ALTER TABLE soz.trace_events ADD COLUMN apartment_id Nullable(Int64), ADD COLUMN fourniture_id Nullable(Int64);
                
            `,
        });
    }

    get name(): string {
        return 'create_fourniture_trace';
    }

    get priority(): number {
        return -11;
    }
}
