import { Module } from '../../core/decorators/module';
import { PlayerDiseaseProvider } from './player.disease.provider';
import { PlayerHealthProvider } from './player.health.provider';
import { PlayerInjuryProvider } from './player.injury.provider';
import { PlayerQbcoreProvider } from './player.qbcore.provider';
import { PlayerStressProvider } from './player.stress.provider';
import { PlayerTokenProvider } from './player.token.provider';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';
import { PlayerWardrobe } from './player.wardrobe';
import { ProgressProvider } from './progress.provider';

@Module({
    providers: [
        PlayerQbcoreProvider,
        ProgressProvider,
        PlayerHealthProvider,
        PlayerDiseaseProvider,
        PlayerStressProvider,
        PlayerWardrobe,
        PlayerWalkstyleProvider,
        PlayerInjuryProvider,
        PlayerTokenProvider,
    ],
})
export class PlayerModule {}
