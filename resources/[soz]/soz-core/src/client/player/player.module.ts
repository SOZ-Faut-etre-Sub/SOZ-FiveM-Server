import { Module } from '../../core/decorators/module';
import { PlayerAnimationProvider } from './player.animation.provider';
import { PlayerAntiFallDownProvider } from './player.antifalldown.provider';
import { PlayerDiseaseProvider } from './player.disease.provider';
import { PlayerEffectProvider } from './player.effect.provider';
import { PlayerHealthProvider } from './player.health.provider';
import { PlayerIdentityProvider } from './player.identity.provider';
import { PlayerInjuryProvider } from './player.injury.provider';
import { PlayerInOutProvider } from './player.inout.provider';
import { PlayerMenuProvider } from './player.menu.provider';
import { PlayerPositionProvider } from './player.position.provider';
import { PlayerQbcoreProvider } from './player.qbcore.provider';
import { PlayerStateProvider } from './player.state.provider';
import { PlayerStressProvider } from './player.stress.provider';
import { PlayerTokenProvider } from './player.token.provider';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';
import { PlayerWardrobe } from './player.wardrobe';
import { ProgressProvider } from './progress.provider';

@Module({
    providers: [
        PlayerAnimationProvider,
        PlayerAntiFallDownProvider,
        PlayerDiseaseProvider,
        PlayerEffectProvider,
        PlayerHealthProvider,
        PlayerIdentityProvider,
        PlayerInjuryProvider,
        PlayerInOutProvider,
        PlayerMenuProvider,
        PlayerPositionProvider,
        PlayerQbcoreProvider,
        PlayerStateProvider,
        PlayerStressProvider,
        PlayerTokenProvider,
        PlayerWalkstyleProvider,
        PlayerWardrobe,
        ProgressProvider,
    ],
})
export class PlayerModule {}
