import { Module } from '../../core/decorators/module';
import { AnimationProvider } from './animation.provider';

@Module({
    providers: [AnimationProvider],
})
export class AnimationModule {}
