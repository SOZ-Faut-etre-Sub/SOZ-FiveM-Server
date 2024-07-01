import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationUpdateDrugMaturation implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                ALTER TABLE soz.trace_events MODIFY COLUMN drug_maturation Nullable(Float64);
            `,
        });
    }

    get name(): string {
        return 'update_drug_maturation';
    }

    get priority(): number {
        return -10;
    }
}
