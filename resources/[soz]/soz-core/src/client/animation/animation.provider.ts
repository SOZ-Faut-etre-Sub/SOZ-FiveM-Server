import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AnimationService } from './animation.service';

@Provider()
export class AnimationProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Once()
    public async init() {
        this.animationService.loop();
    }
}
