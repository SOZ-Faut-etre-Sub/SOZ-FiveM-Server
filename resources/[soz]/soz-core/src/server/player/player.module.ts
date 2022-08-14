import { Module } from '../../core/decorators/module';
import { PlayerHealthProvider } from './player.health.provider';
import { PlayerProvider } from './player.provider';
import { ProgressService } from './progress.service';

@Module({
    providers: [PlayerProvider, ProgressService, PlayerHealthProvider],
})
export class PlayerModule {}
