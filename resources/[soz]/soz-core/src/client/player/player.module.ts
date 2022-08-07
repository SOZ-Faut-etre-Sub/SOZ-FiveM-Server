import { Module } from '../../core/decorators/module';
import { PlayerHealthProvider } from './player.health.provider';
import { PlayerQbcoreProvider } from './player.qbcore.provider';
import { ProgressProvider } from './progress.provider';

@Module({
    providers: [PlayerQbcoreProvider, ProgressProvider, PlayerHealthProvider],
})
export class PlayerModule {}
