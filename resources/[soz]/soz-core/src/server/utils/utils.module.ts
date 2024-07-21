import { Module } from '@public/core/decorators/module';

import { BunkerProvider } from './bunker.provider';
import { UtilsProvider } from './utils.provider';

@Module({
    providers: [UtilsProvider, BunkerProvider],
})
export class UtilsModule {}
