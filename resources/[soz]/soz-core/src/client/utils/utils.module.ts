import { Module } from '@public/core/decorators/module';

import { BunkerProvider } from './bunker.provider';
import { DispenserProvider } from './dispenser.provider';
import { ElevatorProvider } from './elevator.provider';
import { GuardsProvider } from './guards.provider';
import { NoClipProvider } from './noclip.provider';
import { PositionService } from './position.service';
import { DiscordProvider } from './utils.discord.provider';
import { UtilsNPCProvider } from './utils.npc.provider';
import { UtilsProvider } from './utils.provider';

@Module({
    providers: [
        UtilsProvider,
        DispenserProvider,
        NoClipProvider,
        ElevatorProvider,
        DiscordProvider,
        UtilsNPCProvider,
        BunkerProvider,
        GuardsProvider,
        PositionService,
    ],
})
export class UtilsModule {}
