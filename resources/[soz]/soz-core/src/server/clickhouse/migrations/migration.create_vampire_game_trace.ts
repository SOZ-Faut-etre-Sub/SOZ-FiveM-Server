import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationCreateVampireGameTrace implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                ALTER TABLE soz.trace_events ADD COLUMN objective_part Nullable(Int64), ADD COLUMN objective Nullable(String);
            `,
        });
    }

    get name(): string {
        return 'create_vampire_game_trace';
    }

    get priority(): number {
        return -13;
    }
}
