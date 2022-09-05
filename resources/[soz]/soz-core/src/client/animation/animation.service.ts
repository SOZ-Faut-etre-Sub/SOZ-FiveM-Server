import { Inject, Injectable } from '../../core/decorators/injectable';
import { wait } from '../../core/utils';
import { Vector4 } from '../../shared/polyzone/vector';
import { AnimationOptions, animationOptionsToFlags } from '../../shared/progress';
import { Weapons } from '../../shared/weapon';
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

type AnimationTask = {
    animation?: Animation;
    scenario?: Scenario;
    reject: (reason: any) => void;
    resolve: () => void;
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
        const blendInSpeed = animation.blendInSpeed ? animation.blendInSpeed : 1;
        const blendOutSpeed = animation.blendOutSpeed ? animation.blendOutSpeed : -1;
        const duration = animation.duration
            ? animation.duration
            : forceDuration
            ? 1000
            : GetAnimDuration(animation.dictionary, animation.name);
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

    private async doScenario(scenario: Scenario): Promise<void> {
        const ped = PlayerPedId();

        ClearPedTasksImmediately(ped);
        TaskStartScenarioInPlace(ped, scenario.name, 0, true);

        await wait(scenario.duration ? scenario.duration : -1);

        ClearPedTasks(ped);
        ClearPedSecondaryTask(ped);
        SetCurrentPedWeapon(ped, GetHashKey('WEAPON_UNARMED'), true);
    }

    public async loop() {
        this.running = true;

        while (this.running) {
            if (this.queue.length === 0) {
                await wait(100);

                continue;
            }

            const animationPromise = new Promise<void>(resolve => {
                this.currentAnimationLoopResolve = resolve;
            });

            this.currentAnimation = this.queue.shift();

            if (this.currentAnimation.animation) {
                if (this.currentAnimation.animation.enter) {
                    await wait(this.doAnimation(this.currentAnimation.animation.enter, true));
                }

                const duration = this.doAnimation(this.currentAnimation.animation.base, false);

                if (duration !== -1) {
                    await wait(duration);
                } else {
                    await animationPromise;
                }

                if (this.currentAnimation.animation.exit) {
                    await wait(this.doAnimation(this.currentAnimation.animation.exit, true));
                }
            } else if (this.currentAnimation.scenario) {
                await this.doScenario(this.currentAnimation.scenario);
            }

            SetCurrentPedWeapon(PlayerPedId(), GetHashKey(Weapons.UNARMED), true);
            this.currentAnimation.resolve();

            this.currentAnimation = null;
            this.currentAnimationLoopResolve = null;
        }
    }

    public async walkToCoords(coords: Vector4, duration = 1000) {
        TaskGoStraightToCoord(PlayerPedId(), coords[0], coords[1], coords[2], 1.0, duration, coords[3], 0.1);

        await wait(duration);
    }

    public async playScenario(scenario: Scenario): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            this.queue.push({
                scenario,
                reject,
                resolve,
            });
        });

        // Will stop current animation if in loop
        if (this.currentAnimationLoopResolve) {
            this.currentAnimationLoopResolve();
        }

        return promise;
    }

    public async playAnimation(animation: Animation): Promise<void> {
        if (animation.enter?.dictionary) {
            await this.resourceLoader.loadAnimationDictionary(animation.enter.dictionary);
        }

        if (animation.base.dictionary) {
            await this.resourceLoader.loadAnimationDictionary(animation.base.dictionary);
        }

        if (animation.exit?.dictionary) {
            await this.resourceLoader.loadAnimationDictionary(animation.exit.dictionary);
        }

        const promise = new Promise<void>((resolve, reject) => {
            this.queue.push({
                animation,
                reject,
                resolve,
            });
        });

        // Will stop current animation if in loop
        if (this.currentAnimationLoopResolve) {
            this.currentAnimationLoopResolve();
        }

        return promise;
    }

    public async stop() {
        if (this.currentAnimationLoopResolve) {
            this.currentAnimationLoopResolve();
        }
    }

    public async destroy() {
        await this.stop();
        this.running = false;
    }
}
