import { wait } from '@public/core/utils';
import { Vfx } from '@public/shared/animation';
import { ClientEvent } from '@public/shared/event/client';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ResourceLoader } from '../repository/resource.loader';
import { AnimationService } from './animation.service';

@Provider()
export class AnimationProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Once(OnceStep.Stop)
    public stop() {
        this.animationService.stop();
    }

    @OnEvent(ClientEvent.ANIMATION_FX)
    public async onAnimationFx(objectNetId: number, fx: Vfx, bone: number) {
        if (!NetworkDoesNetworkIdExist(objectNetId)) {
            return;
        }

        const entity = NetToObj(objectNetId);
        await this.resourceLoader.loadPtfxAsset(fx.dictionary);

        UseParticleFxAsset(fx.dictionary);

        let fxId = 0;
        if (bone) {
            fxId = StartParticleFxLoopedOnEntityBone(
                fx.name,
                entity,
                fx.position[0],
                fx.position[1],
                fx.position[2],
                fx.rotation[0],
                fx.rotation[1],
                fx.rotation[2],
                bone,
                fx.scale,
                false,
                false,
                false
            );
        } else {
            fxId = StartParticleFxLoopedOnEntity(
                fx.name,
                entity,
                fx.position[0],
                fx.position[1],
                fx.position[2],
                fx.rotation[0],
                fx.rotation[1],
                fx.rotation[2],
                fx.scale,
                false,
                false,
                false
            );
        }

        await wait(fx.delay);
        StopParticleFxLooped(fxId, false);

        this.resourceLoader.unloadPtfxAsset(fx.dictionary);
    }

    @OnEvent(ClientEvent.ANIMATION_FX_POSITION)
    public async onAnimationFxPosition(fx: Vfx) {
        await this.resourceLoader.loadPtfxAsset(fx.dictionary);

        UseParticleFxAsset(fx.dictionary);

        const fxId = StartParticleFxLoopedAtCoord(
            fx.name,
            fx.position[0],
            fx.position[1],
            fx.position[2],
            fx.rotation[0],
            fx.rotation[1],
            fx.rotation[2],
            fx.scale,
            false,
            false,
            false,
            false
        );
        await wait(fx.delay);
        StopParticleFxLooped(fxId, false);

        this.resourceLoader.unloadPtfxAsset(fx.dictionary);
    }
}
