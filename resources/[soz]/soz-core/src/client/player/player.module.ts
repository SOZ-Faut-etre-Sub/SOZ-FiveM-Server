import { Module } from '../../core/decorators/module';
import { PlayerDiseaseProvider } from './player.disease.provider';
import { PlayerHealthProvider } from './player.health.provider';
import { PlayerQbcoreProvider } from './player.qbcore.provider';
import { PlayerStressProvider } from './player.stress.provider';
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
    ],
})
export class PlayerModule {}
