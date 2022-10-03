import { Module } from '../../core/decorators/module';
import { PlayerDiseaseProvider } from './player.disease.provider';
import { PlayerHealthProvider } from './player.health.provider';
import { PlayerProvider } from './player.provider';
import { ProgressService } from './progress.service';

@Module({
    providers: [PlayerProvider, ProgressService, PlayerHealthProvider, PlayerDiseaseProvider],
})
export class PlayerModule {}
