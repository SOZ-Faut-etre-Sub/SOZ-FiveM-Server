import { Module } from '../../core/decorators/module';
import { AnimationHandsUpProvider } from './animation.handsup.provider';
import { AnimationPointProvider } from './animation.point.provider';
import { AnimationProvider } from './animation.provider';
import { AnimationRagdollProvider } from './animation.ragdoll.provider';
import { SeatAnimationProvider } from './animation.world.provider';

@Module({
    providers: [
        AnimationHandsUpProvider,
        AnimationPointProvider,
        AnimationProvider,
        AnimationRagdollProvider,
        SeatAnimationProvider,
    ],
})
export class AnimationModule {}
