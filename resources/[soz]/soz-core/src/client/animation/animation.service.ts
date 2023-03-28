import { Inject, Injectable } from '@core/decorators/injectable';
import { wait, waitUntil } from '@core/utils';
import { AnimationFactory, AnimationRunner } from '@public/client/animation/animation.factory';

import { Animation, AnimationStopReason, PlayOptions, Scenario } from '../../shared/animation';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3, Vector4 } from '../../shared/polyzone/vector';

@Injectable()
export class AnimationService {
    @Inject(AnimationFactory)
    private animationFactory: AnimationFactory;

    private runningAnimations: Map<string, AnimationRunner> = new Map();

    public async walkToCoords(coords: Vector4, duration = 1000) {
        const playerPed = PlayerPedId();
        TaskGoStraightToCoord(PlayerPedId(), coords[0], coords[1], coords[2], 1.0, duration, coords[3], 0.1);

        const zone: BoxZone = new BoxZone([coords[0], coords[1], coords[2]], 1, 1);
        const interval = 500;
        for (let i = 0; i < duration - interval; i += interval) {
            if (
                zone.isPointInside(GetEntityCoords(playerPed) as Vector3) &&
                Math.abs(GetEntityHeading(playerPed) - coords[3]) < 5
            ) {
                break;
            }

            await wait(interval);
        }
        await wait(interval);
    }

    public playAnimationIfNotRunning(animation: Animation, options?: Partial<PlayOptions>) {
        const id = animation.base.dictionary + animation.base.name;

        if (!this.runningAnimations.has(id)) {
            const runner = this.animationFactory.createAnimation(animation, options);
            this.runningAnimations.set(id, runner);

            runner.finally(() => {
                this.runningAnimations.delete(id);
            });
        }
    }

    public stopAnimationIfRunning(animation: Animation) {
        const id = animation.base.dictionary + animation.base.name;

        if (this.runningAnimations.has(id)) {
            this.runningAnimations.get(id).cancel(AnimationStopReason.Canceled);
        }
    }
    public async walkToCoordsAvoidObstacles(coords: Vector3 | Vector4, maxDuration = 5000) {
        const ped = PlayerPedId();
        TaskGoToCoordAnyMeans(ped, coords[0], coords[1], coords[2], 1.0, 0, false, 786603, 0xbf800000);
        const zone: BoxZone = new BoxZone([coords[0], coords[1], coords[2]], 1.5, 1.5);
        const interval = 500;
        for (let i = 0; i < maxDuration; i += interval) {
            if (zone.isPointInside(GetEntityCoords(ped) as Vector3)) {
                break;
            }

            await wait(interval);
        }
        ClearPedTasks(ped);
    }

    public toggleAnimation(animation: Animation, options?: Partial<PlayOptions>) {
        const id = animation.base.dictionary + animation.base.name;

        if (this.runningAnimations.has(id)) {
            this.runningAnimations.get(id).cancel(AnimationStopReason.Canceled);
        } else {
            const runner = this.animationFactory.createAnimation(animation, options);
            this.runningAnimations.set(id, runner);

            runner.finally(() => {
                this.runningAnimations.delete(id);
            });
        }
    }

    public toggleScenario(scenario: Scenario, options?: Partial<PlayOptions>) {
        const id = scenario.name;

        if (this.runningAnimations.has(id)) {
            this.runningAnimations.get(id).cancel(AnimationStopReason.Canceled);
        } else {
            const runner = this.animationFactory.createScenario(scenario, options);
            this.runningAnimations.set(id, runner);

            runner.finally(() => {
                this.runningAnimations.delete(id);
            });
        }
    }

    public playScenario(scenario: Scenario, options?: Partial<PlayOptions>): AnimationRunner {
        return this.animationFactory.createScenario(scenario, options);
    }

    public playAnimation(animation: Animation, options?: Partial<PlayOptions>): AnimationRunner {
        return this.animationFactory.createAnimation(animation, options);
    }

    public async stop(ped = PlayerPedId()): Promise<void> {
        ClearPedTasks(ped);
        ClearPedSecondaryTask(ped);

        await waitUntil(async () => !IsPedUsingAnyScenario(ped), 1000);
    }

    public destroy() {
        this.stop();
    }
}
