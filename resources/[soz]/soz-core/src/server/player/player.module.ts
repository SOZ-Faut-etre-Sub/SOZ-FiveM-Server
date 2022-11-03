import { Module } from '../../core/decorators/module';
import { PlayerAppearanceService } from './player.appearance.service';
import { PlayerDiseaseProvider } from './player.disease.provider';
import { PlayerHealthProvider } from './player.health.provider';
import { PlayerProvider } from './player.provider';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';
import { ProgressService } from './progress.service';

@Module({
    providers: [
        PlayerProvider,
        ProgressService,
        PlayerHealthProvider,
        PlayerDiseaseProvider,
        PlayerAppearanceService,
        PlayerWalkstyleProvider,
    ],
})
export class PlayerModule {}
