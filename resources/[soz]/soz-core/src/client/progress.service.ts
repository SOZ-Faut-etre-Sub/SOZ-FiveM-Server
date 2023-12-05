import { Inject, Injectable } from '@core/decorators/injectable';
import { wait } from '@core/utils';
import { AudioService } from '@public/client/nui/audio.service';
import { animationOptionsToFlags, AnimationProps, AnimationStopReason } from '@public/shared/animation';
import { fromVector3Object } from '@public/shared/polyzone/vector';
import PCancelable from 'p-cancelable';

import { ProgressAnimation, ProgressOptions, ProgressResult } from '../shared/progress';
import { AnimationService } from './animation/animation.service';
import { Notifier } from './notifier';

@Injectable()
export class ProgressService {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(AudioService)
    private audioService: AudioService;

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
            disableNui: false,
            allowExistingAnimation: false,
            ...options,
        };

        if (this.isDoingAction()) {
            this.notifier.notify('Une action est déjà en cours !', 'error');
            return { completed: false, progress: 0 };
        }

        if (!options.allowExistingAnimation) {
            await this.animationService.stop();
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

        let audioId = null;

        if (options.audio) {
            audioId = this.audioService.playAudio(options.audio.path, options.audio.volume || 0.5);
        }

        const start = GetGameTimer();
        let promiseResolve;
        const cancel = () => {
            this.cancel();
        };
        const promise = new PCancelable<ProgressResult>(function (resolve, reject, onCancel) {
            promiseResolve = resolve;

            onCancel(() => {
                cancel();
            });
        }).finally(() => {
            if (audioId) {
                this.audioService.stopAudio(audioId);
            }
        });

        let runner = null;

        if (options.useAnimationService && animation) {
            if (animation.task) {
                runner = this.animationService.playScenario({ name: animation.task, duration: duration });
            } else {
                const props: AnimationProps[] = animation.props ? [...animation.props] : [];
                if (options.firstProp) {
                    props.push({
                        bone: options.firstProp.bone,
                        model: options.firstProp.model,
                        position: fromVector3Object(options.firstProp.coords),
                        rotation: options.firstProp.rotation
                            ? fromVector3Object(options.firstProp.rotation)
                            : [0, 0, 0],
                    });
                    options.firstProp = null;
                }

                if (options.secondProp) {
                    props.push({
                        bone: options.secondProp.bone,
                        model: options.secondProp.model,
                        position: fromVector3Object(options.secondProp.coords),
                        rotation: options.secondProp.rotation
                            ? fromVector3Object(options.secondProp.rotation)
                            : [0, 0, 0],
                    });
                    options.secondProp = null;
                }

                runner = this.animationService.playAnimation(
                    {
                        base: {
                            dictionary: animation.dictionary,
                            name: animation.name,
                            blendInSpeed: animation.blendInSpeed,
                            blendOutSpeed: animation.blendOutSpeed,
                            playbackRate: animation.playbackRate,
                            options: animation.options,
                            duration: duration,
                        },
                        props: props,
                    },
                    {
                        resetWeapon: false,
                    }
                );
            }

            runner.then((stopReason: AnimationStopReason) => {
                if (stopReason !== AnimationStopReason.Finished) {
                    cancel();
                }
            });

            animation = null;
        }

        exports['progressbar'].ProgressWithStartAndTick(
            {
                name: name.toLowerCase(),
                duration,
                label,
                disableNui: options.disableNui,
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
                if (runner !== null) {
                    runner.cancel();
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
