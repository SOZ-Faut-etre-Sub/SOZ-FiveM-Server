import { Module } from '@public/core/decorators/module';

import { DispenserProvider } from './dispenser.provider';
import { ElevatorProvider } from './elevator.provider';
import { NoClipProvider } from './noclip.provider';
import { DiscordProvider } from './utils.discord.provider';
import { UtilsNPCProvider } from './utils.npc.provider';
import { UtilsProvider } from './utils.provider';

@Module({
    providers: [UtilsProvider, DispenserProvider, NoClipProvider, ElevatorProvider, DiscordProvider, UtilsNPCProvider],
})
export class UtilsModule {}
