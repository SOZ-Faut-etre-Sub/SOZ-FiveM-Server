import { Module } from '../../core/decorators/module';
import { ClickhouseMigrationProvider } from './clickhouse.migration.provider';

@Module({
    providers: [ClickhouseMigrationProvider],
})
export class ClickhouseModule {}
