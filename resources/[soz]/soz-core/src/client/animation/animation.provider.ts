import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ResourceLoader } from '../resources/resource.loader';
import { AnimationService } from './animation.service';

@Provider()
export class AnimationProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

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

    @Once()
    public async onStart() {
        // const walkStyle = 'move_m@quick';
        // await this.resourceLoader.loadAnimationSet(walkStyle);
        //
        // SetPedMovementClipset(PlayerPedId(), walkStyle, 0.2);
        //
        // this.resourceLoader.unloadedAnimationSet(walkStyle);
    }
}
