import { AnimationConfigCategory, AnimationConfigItem, Vfx } from '@public/shared/animation';
import { NuiEvent } from '@public/shared/event';
import { ClientEvent } from '@public/shared/event/client';

import { Animations } from '../../config/animation';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { InputService } from '../nui/input.service';
import { AnimationService } from './animation.service';

@Provider()
export class AnimationProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(InputService)
    private input: InputService;

    @Once(OnceStep.Stop)
    public stop() {
        this.animationService.stop();
    }

    @OnEvent(ClientEvent.ANIMATION_FX)
    public onAnimationFx(objectNetId: number, fx: Vfx) {
        if (!NetworkDoesNetworkIdExist(objectNetId)) {
            return;
        }

        const entity = NetToObj(objectNetId);

        UseParticleFxAsset(fx.dictionary);
        StartParticleFxNonLoopedOnEntity(
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

    @OnNuiEvent(NuiEvent.PlayerMenuAnimationSearch)
    public async handleSearchAnimation() {
        try {
            let searchAnimation = await this.input.askInput({
                title: `Nom de l'animation`,
                defaultValue: '',
                maxCharacters: 16,
            });

            if (!searchAnimation) {
                return [];
            }
            searchAnimation = searchAnimation
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

            const animations: AnimationConfigItem[] = [];
            // Search the animation in the animation config
            for (const animation of Animations as AnimationConfigCategory[]) {
                animation.items.forEach(item => {
                    const animationName = item.name
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '');
                    if (animationName.includes(searchAnimation)) {
                        animations.push(item);
                    }
                });
            }
            // Secure: if some duplicates are found, we keep only one
            const uniqueAnimations = Object.values(
                animations.reduce(
                    (acc, animation) => {
                        acc[animation.name] = animation;
                        return acc;
                    },
                    {} as { [key: string]: (typeof animations)[0] }
                )
            );

            if (uniqueAnimations.length === 0) {
                return [];
            }

            uniqueAnimations.sort((a, b) => a.name.localeCompare(b.name));

            return uniqueAnimations;
        } catch (e) {
            return [];
        }
    }
}
