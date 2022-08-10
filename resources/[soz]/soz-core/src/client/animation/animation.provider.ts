import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AnimationService } from './animation.service';

@Provider()
export class AnimationProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    private animationLoop: Promise<void> | null = null;

    @Once()
    public async init() {
        this.animationLoop = this.animationService.loop();
    }

    @Once(OnceStep.Stop)
    public async stop() {
        await this.animationService.destroy();
        this.animationLoop = null;
    }
}
