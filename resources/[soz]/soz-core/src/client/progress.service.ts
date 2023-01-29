import PCancelable from 'p-cancelable';

import { Inject, Injectable } from '../core/decorators/injectable';
import { wait } from '../core/utils';
import { animationOptionsToFlags, ProgressAnimation, ProgressOptions, ProgressResult } from '../shared/progress';
import { AnimationService } from './animation/animation.service';
import { Notifier } from './notifier';

@Injectable()
export class ProgressService {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(Notifier)
    private notifier: Notifier;

    public async progress(
        name: string,
        label: string,
        duration: number,
        animation?: ProgressAnimation,
        options: Partial<ProgressOptions> = {}
    ): Promise<ProgressResult> {
        options = {
            useWhileDead: false,
            canCancel: true,
            disableCombat: true,
            ...options,
        };

        if (this.isDoingAction()) {
            this.notifier.notify('Une action est déjà en cours !', 'error');
            return { completed: false, progress: 0 };
        }

        if (options.headingEntity) {
            TaskTurnPedToFaceEntity(PlayerPedId(), options.headingEntity.entity, 1000);
            await wait(1000);

            if (options.headingEntity.heading !== 0) {
                const heading = GetEntityHeading(PlayerPedId());
                SetEntityHeading(PlayerPedId(), (heading + options.headingEntity.heading) % 360);
            }
        }

        if (!options.ignorePollution) {
            duration = exports['soz-upw'].CalculateDuration(duration);
        }

        const start = GetGameTimer();
        let promiseResolve;
        const promise = new PCancelable<ProgressResult>(function (resolve, reject, onCancel) {
            promiseResolve = resolve;

            onCancel(() => {
                this.cancel();
            });
        });

        if (options.useAnimationService && animation) {
            if (animation.task) {
                this.animationService.playScenario({ name: animation.task }).then((cancelled: boolean) => {
                    if (cancelled) {
                        this.cancel();
                    }
                });
            } else {
                this.animationService
                    .playAnimation(
                        {
                            base: {
                                dictionary: animation.dictionary,
                                name: animation.name,
                                blendInSpeed: animation.blendInSpeed,
                                blendOutSpeed: animation.blendOutSpeed,
                                playbackRate: animation.playbackRate,
                                options: animation.options,
                            },
                        },
                        {
                            reset_weapon: false,
                        }
                    )
                    .then((cancelled: boolean) => {
                        if (cancelled) {
                            this.cancel();
                        }
                    });
            }
            animation = null;
        }

        exports['progressbar'].ProgressWithStartAndTick(
            {
                name: name.toLowerCase(),
                duration,
                label,
                useWhileDead: options.useWhileDead,
                canCancel: options.canCancel,
                controlDisables: {
                    disableCombat: options.disableCombat,
                    disableMovement: options.disableMovement,
                    disableCarMovement: options.disableCarMovement,
                    disableMouse: options.disableMouse,
                },
                animation: animation
                    ? {
                          animDict: animation.dictionary,
                          anim: animation.name,
                          flags: animation.options ? animationOptionsToFlags(animation.options) : animation.flags || 0,
                          task: animation.task,
                      }
                    : null,
                prop: options.firstProp || {},
                propTwo: options.secondProp || {},
                no_inv_busy: options.no_inv_busy,
            },
            options.start,
            options.tick,
            (cancelled: boolean) => {
                if (options.useAnimationService) {
                    this.animationService.stop();
                }
                if (cancelled) {
                    const elapsedBeforeCancel = (GetGameTimer() - start) / duration;

                    promiseResolve({
                        completed: false,
                        progress: elapsedBeforeCancel,
                    });
                } else {
                    promiseResolve({
                        completed: true,
                        progress: 1,
                    });
                }
            }
        );

        return promise;
    }

    public isDoingAction(): boolean {
        return exports['progressbar'].IsDoingAction();
    }

    public cancel() {
        TriggerEvent('progressbar:client:cancel');
    }
}
