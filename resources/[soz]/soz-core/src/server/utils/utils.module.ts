import { Module } from '@public/core/decorators/module';

import { BunkerProvider } from './bunker.provider';
import { NpcProvider } from './npc.provider';
import { UtilsProvider } from './utils.provider';

@Module({
    providers: [UtilsProvider, NpcProvider, BunkerProvider],
})
export class UtilsModule {}
