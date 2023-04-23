import { Module } from '../../core/decorators/module';
import { AnimationProvider } from './animation.provider';
import { SeatAnimationProvider } from './animation.world.provider';

@Module({
    providers: [AnimationProvider, SeatAnimationProvider],
})
export class AnimationModule {}
