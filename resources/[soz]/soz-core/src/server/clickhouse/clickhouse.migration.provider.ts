import './migrations';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject, MultiInject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClickhouseService } from './clickhouse.service';
import { ClickhouseMigration } from './migrations/migration.interface';

@Provider()
export class ClickhouseMigrationProvider {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    @MultiInject('ClickhouseMigration')
    private migrations: ClickhouseMigration[];

    @Once(OnceStep.Start)
    async migrateDatabase() {
        await this.createMigrationTable();

        const sortedMigrations = this.migrations.sort((a, b) => b.priority - a.priority);

        for (const migration of sortedMigrations) {
            const start = Date.now();
            const exists = await this.clickhouseService.query({
                query: 'SELECT name FROM migrations WHERE name = {name: String}',
                query_params: {
                    name: migration.name,
                },
            });

            const result = await exists.json();

            if (result.rows > 0) {
                continue;
            }

            await migration.migrate();
            const duration = Date.now() - start;

            await this.clickhouseService.insert({
                table: 'migrations',
                values: [
                    {
                        name: migration.name,
                        execution_time: duration,
                    },
                ],
                format: 'JSONEachRow',
            });
        }
    }

    private async createMigrationTable() {
        await this.clickhouseService.exec({
            query: `
                CREATE TABLE IF NOT EXISTS migrations
                (
                    name String,
                    executed_at DateTime DEFAULT now
                (
                ),
                    execution_time UInt32
                    )
                    ENGINE = MergeTree()
                    PRIMARY KEY
                (
                    name
                )
            `,
        });
    }
}
