import { Module } from '../../core/decorators/module';

import { TcgMigrationProvider } from './tcg.migration.provider';
import { TcgProvider } from './tcg.provider';

@Module({
    providers: [TcgProvider, TcgMigrationProvider],
})
export class TcgModule {}