import { wait } from '@public/core/utils';
import { Vfx } from '@public/shared/animation';
import { ClientEvent } from '@public/shared/event/client';
import { Vector3 } from '@public/shared/polyzone/vector';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ObjectProvider } from '../object/object.provider';
import { ResourceLoader } from '../repository/resource.loader';
import { AnimationService } from './animation.service';

@Provider()
export class AnimationProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

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

    @OnEvent(ClientEvent.ANIMATION_OBJECT_WORLD)
    public async onAnimationObjectWorld(dict: string, name: string, model: number, position: Vector3) {
        const obj = GetClosestObjectOfType(position[0], position[1], position[2], 0.2, model, false, false, false);
        if (!obj) {
            return;
        }

        await this.playEntityAnim(obj, dict, name);
    }

    @OnEvent(ClientEvent.ANIMATION_OBJECT_GRID)
    public async onAnimationObjectGrid(dict: string, name: string, id: string) {
        const obj = this.objectProvider.getEntityFromId(id);

        await this.playEntityAnim(obj, dict, name);
    }

    private async playEntityAnim(entity: number, dict: string, name: string) {
        await this.resourceLoader.loadAnimationDictionary(dict);

        PlayEntityAnim(entity, name, dict, 1000.0, false, true, false, 0.0, 0);

        this.resourceLoader.unloadAnimationDictionary(dict);
    }
}
