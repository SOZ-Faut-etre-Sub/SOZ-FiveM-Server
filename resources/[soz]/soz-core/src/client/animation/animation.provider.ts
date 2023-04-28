import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AnimationService } from './animation.service';

@Provider()
export class AnimationProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Once(OnceStep.Stop)
    public stop() {
        this.animationService.stop(true);
    }
}
