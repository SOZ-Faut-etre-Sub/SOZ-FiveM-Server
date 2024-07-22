import { Inject, Injectable } from '@core/decorators/injectable';
import { wait } from '@core/utils';
import { AnimationRunner } from '@public/client/animation/animation.factory';
import { InstructionalService } from '@public/client/instructional.service';
import { AudioService } from '@public/client/nui/audio.service';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { PlayerService } from '@public/client/player/player.service';
import { animationFlagsToOptions, AnimationProps, AnimationStopReason } from '@public/shared/animation';
import { Control } from '@public/shared/input';
import { fromVector3Object } from '@public/shared/polyzone/vector';
import PCancelable from 'p-cancelable';

import { ProgressAnimation, ProgressOptions, ProgressResult } from '../shared/progress';
import { AnimationService } from './animation/animation.service';
import { Notifier } from './notifier';

@Injectable()
export class ProgressService {
    @Inject(AnimationService)
    private readonly animationService: AnimationService;

    @Inject(AudioService)
    private readonly audioService: AudioService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(InstructionalService)
    private readonly instructionalService: InstructionalService;

    private currentAction: Partial<ProgressOptions> | null = null;
    private currentPromise: PCancelable<ProgressResult> | null = null;
    private animationRunner: AnimationRunner | null = null;

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

        const ped = PlayerPedId();

        if (IsEntityDead(ped) && !options.useWhileDead) {
            this.notifier.notify('Vous ne pouvez réaliser cette action !', 'error');
            return { completed: false, progress: 0 };
        }

        if (this.isDoingAction()) {
            this.notifier.notify('Une action est déjà en cours !', 'error');
            return { completed: false, progress: 0 };
        }

        this.currentAction = options;

        if (!options.allowExistingAnimation) {
            await this.animationService.stop();
        }

        if (!options.no_inv_busy) {
            this.playerService.updateState({
                isInventoryBusy: true,
            });
            exports['soz-phone'].setPhoneVisible(false);
            this.nuiDispatch.closeEverything();
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

        if (animation && (animation.task || animation.name)) {
            if (animation.task) {
                this.animationRunner = this.animationService.playScenario({ name: animation.task, duration: duration });
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

                if (!animation.options) {
                    if (animation.flags) {
                        animation.options = animationFlagsToOptions(animation.flags);
                    } else {
                        animation.options = {
                            repeat: true,
                        };
                    }
                }

                if (!animation.options.repeat && !animation.flags) {
                    animation.options.repeat = true;
                }

                this.animationRunner = this.animationService.playAnimation(
                    {
                        base: {
                            dictionary: animation.dictionary,
                            name: animation.name,
                            blendInSpeed: animation.blendInSpeed,
                            blendOutSpeed: animation.blendOutSpeed,
                            playbackRate: animation.playbackRate,
                            options: animation.options,
                            duration: animation.options.repeat ? -1 : duration,
                        },
                        props: props,
                    },
                    {
                        resetWeapon: false,
                    }
                );
            }

            this.animationRunner.then((stopReason: AnimationStopReason) => {
                if (options.allowExistingAnimation) return;

                if (stopReason !== AnimationStopReason.Finished) {
                    this.cancel();
                }
            });

            animation = null;
        }

        const beforeCallback = () => {
            options.start?.();

            this.instructionalService.display([
                'Appuyez sur',
                Control.FrontendRRight,
                'ou',
                Control.CursorCancel,
                'pour annuler',
            ]);
            this.nuiDispatch.dispatch('progress', 'Start', {
                label,
                duration,
                units: options.units,
            });
        };

        const afterCallback = () => {
            this.animationRunner?.cancel(AnimationStopReason.Finished);

            if (audioId) {
                this.audioService.stopAudio(audioId);
            }

            this.finish();
        };

        this.currentPromise = new PCancelable<ProgressResult>(async (resolve, reject, onCancel) => {
            let isCanceled = false;

            onCancel(() => {
                const elapsedBeforeCancel = (GetGameTimer() - start) / duration;

                onCancel.shouldReject = false;
                resolve({
                    completed: false,
                    progress: elapsedBeforeCancel,
                });

                isCanceled = true;
            });

            beforeCallback();
            await wait(duration);

            if (isCanceled) return;

            afterCallback();
            resolve({
                completed: true,
                progress: 1,
            });
        });

        return this.currentPromise;
    }

    public get current(): Partial<ProgressOptions> | null {
        return this.currentAction;
    }

    public isDoingAction(): boolean {
        return Boolean(this.currentAction);
    }

    public finish(): void {
        this.stop();
    }

    public cancel(): void {
        if (this.currentPromise?.isCanceled) return;

        this.currentPromise?.cancel();
        this.stop();
    }

    public stop(): void {
        this.nuiDispatch.dispatch('progress', 'Stop');
        this.instructionalService.clear();

        this.playerService.updateState({
            isInventoryBusy: false,
        });

        this.animationRunner?.cancel(AnimationStopReason.Finished);
        this.currentAction = null;
    }
}
