import { Module } from '../../core/decorators/module';
import { AnimationProvider } from './animation.provider';
import { SeatAnimationProvider } from './seats.animation.provider';

@Module({
    providers: [
        AnimationProvider,
        SeatAnimationProvider,
    ],

})
export class AnimationModule {}
