import PCancelable from 'p-cancelable';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { wait, waitUntil } from '../../core/utils';
import { Vector4 } from '../../shared/polyzone/vector';
import { AnimationOptions, animationOptionsToFlags } from '../../shared/progress';
import { WeaponName, Weapons } from '../../shared/weapons/weapon';
import { ResourceLoader } from '../resources/resource.loader';

export type Animation = {
    enter?: AnimationInfo;
    base: AnimationInfo;
    exit?: AnimationInfo;
};

export type Scenario = {
    name: string;
    duration?: number;
};

export type AnimationInfo = {
    dictionary: string;
    name: string;
    duration?: number;
    blendInSpeed?: number;
    blendOutSpeed?: number;
    playbackRate?: number;
    lockX?: boolean;
    lockY?: boolean;
    lockZ?: boolean;
    options?: AnimationOptions;
};

type PlayOptions = {
    reset_weapon?: boolean;
};

type AnimationTask = {
    animation?: Animation;
    scenario?: Scenario;
    play_options?: PlayOptions;
    reject: (reason: any) => void;
    resolve: (cancelled: boolean) => void;
};

@Injectable()
export class AnimationService {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private queue: AnimationTask[] = [];

    private running = false;

    private currentAnimation: AnimationTask | null = null;

    private currentAnimationLoopResolve: () => void;

    private doAnimation(animation: AnimationInfo, forceDuration: boolean): number {
        const duration = animation.duration
            ? animation.duration
            : forceDuration
            ? 1000
            : animation.options?.repeat
            ? -1
            : GetAnimDuration(animation.dictionary, animation.name);

        const blendInSpeed = animation.blendInSpeed ? animation.blendInSpeed : 1;
        const blendOutSpeed = animation.blendOutSpeed ? animation.blendOutSpeed : 1;
        const flags = animationOptionsToFlags(animation.options || {});
        const playbackRate = animation.playbackRate ? animation.playbackRate : 0.0;
        const lockX = animation.lockX ? animation.lockX : false;
        const lockY = animation.lockY ? animation.lockY : false;
        const lockZ = animation.lockZ ? animation.lockZ : false;

        TaskPlayAnim(
            PlayerPedId(),
            animation.dictionary,
            animation.name,
            blendInSpeed,
            blendOutSpeed,
            duration,
            flags,
            playbackRate,
            lockX,
            lockY,
            lockZ
        );

        return duration;
    }

    private async waitUntilCancelled(animation: AnimationInfo, duration: number | PCancelable<void>): Promise<boolean> {
        const ped = PlayerPedId();
        const until = async () => {
            return !IsEntityPlayingAnim(ped, animation.dictionary, animation.name, 3);
        };

        if (typeof duration === 'number') {
            return waitUntil(until, duration);
        }

        const waitUntilPromise = waitUntil(until);
        const durationPromise = async () => {
            await duration;

            return false;
        };

        const cancelled = await Promise.race([waitUntilPromise, durationPromise()]);

        waitUntilPromise.cancel();
        duration.cancel();

        return cancelled;
    }

    private async doScenario(scenario: Scenario): Promise<boolean> {
        const ped = PlayerPedId();

        ClearPedTasksImmediately(ped);
        TaskStartScenarioInPlace(ped, scenario.name, 0, true);

        return waitUntil(
            async () => {
                return !IsPedUsingScenario(ped, scenario.name);
            },
            scenario.duration ? scenario.duration : -1
        );
    }

    public async loop() {
        this.running = true;

        while (this.running) {
            if (this.queue.length === 0) {
                await wait(100);

                continue;
            }

            const animationPromise = new PCancelable<void>(resolve => {
                this.currentAnimationLoopResolve = resolve;
            });

            this.currentAnimation = this.queue.shift();

            const options = this.currentAnimation.play_options || {
                reset_weapon: true,
            };

            let cancelled = false;

            if (this.currentAnimation.animation) {
                if (this.currentAnimation.animation.enter) {
                    cancelled = await this.waitUntilCancelled(
                        this.currentAnimation.animation.enter,
                        this.doAnimation(this.currentAnimation.animation.enter, true)
                    );
                }

                if (!cancelled) {
                    const duration = this.doAnimation(this.currentAnimation.animation.base, false);

                    cancelled = await this.waitUntilCancelled(
                        this.currentAnimation.animation.base,
                        duration !== -1 ? duration : animationPromise
                    );
                }

                if (!cancelled && this.currentAnimation.animation.exit) {
                    cancelled = await this.waitUntilCancelled(
                        this.currentAnimation.animation.exit,
                        this.doAnimation(this.currentAnimation.animation.exit, true)
                    );
                }
            } else if (this.currentAnimation.scenario) {
                cancelled = await this.doScenario(this.currentAnimation.scenario);
            }

            const ped = PlayerPedId();

            if (options.reset_weapon) {
                SetCurrentPedWeapon(ped, GetHashKey(WeaponName.UNARMED), true);
            }

            this.currentAnimation.resolve(cancelled);

            this.currentAnimation = null;
            this.currentAnimationLoopResolve = null;

            await wait(100);

            ClearPedTasks(ped);
            ClearPedSecondaryTask(ped);
        }
    }

    public async walkToCoords(coords: Vector4, duration = 1000) {
        TaskGoStraightToCoord(PlayerPedId(), coords[0], coords[1], coords[2], 1.0, duration, coords[3], 0.1);

        await wait(duration);
    }

    public async playScenario(scenario: Scenario, options?: PlayOptions): Promise<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            this.queue.push({
                scenario,
                reject,
                resolve,
                play_options: options,
            });
        });

        // Will stop current animation if in loop
        if (this.currentAnimationLoopResolve) {
            this.currentAnimationLoopResolve();
        }

        return promise;
    }

    public async playAnimation(animation: Animation, options?: PlayOptions): Promise<boolean> {
        if (animation.enter?.dictionary) {
            await this.resourceLoader.loadAnimationDictionary(animation.enter.dictionary);
        }

        if (animation.base.dictionary) {
            await this.resourceLoader.loadAnimationDictionary(animation.base.dictionary);
        }

        if (animation.exit?.dictionary) {
            await this.resourceLoader.loadAnimationDictionary(animation.exit.dictionary);
        }

        const promise = new Promise<boolean>((resolve, reject) => {
            this.queue.push({
                animation,
                reject,
                resolve,
                play_options: options,
            });
        });

        // Will stop current animation if in loop
        if (this.currentAnimationLoopResolve) {
            this.currentAnimationLoopResolve();
        }

        return promise;
    }

    public stop() {
        if (this.currentAnimationLoopResolve) {
            this.currentAnimationLoopResolve();
        }
    }

    public destroy() {
        this.stop();
        this.running = false;
    }
}
