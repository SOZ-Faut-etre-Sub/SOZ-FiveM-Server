import { Inject, Injectable } from '@core/decorators/injectable';
import { wait, waitUntil } from '@core/utils';

import {
    Animation,
    AnimationInfo,
    animationOptionsToFlags,
    AnimationStopReason,
    PlayOptions,
    Scenario,
} from '../../shared/animation';
import { Vector3 } from '../../shared/polyzone/vector';
import { WeaponName } from '../../shared/weapons/weapon';
import { ResourceLoader } from '../resources/resource.loader';

const defaultPlayOptions: PlayOptions = {
    ped: null,
    resetWeapon: false,
    clearTasksBefore: false,
    clearTasksAfter: false,
};

class AnimationCanceller {
    public onCancel: (reason: AnimationStopReason) => void = () => {};

    public cancel(reason: AnimationStopReason): void {
        this.onCancel(reason);
    }
}

export class AnimationRunner implements Promise<AnimationStopReason> {
    public running = true;

    private static seq = 0;

    readonly id = AnimationRunner.seq++;

    private readonly promise: Promise<AnimationStopReason>;

    private animationCanceller: AnimationCanceller;

    constructor(innerPromise: Promise<AnimationStopReason>, animationCanceller: AnimationCanceller) {
        this.promise = new Promise((resolve, reject) => {
            innerPromise
                .then(
                    r => resolve(r),
                    e => reject(e)
                )
                .finally(() => (this.running = false));
        });

        this.animationCanceller = animationCanceller;
    }

    public cancel(reason: AnimationStopReason = AnimationStopReason.Canceled): void {
        if (this.running) {
            this.animationCanceller.cancel(reason);
        }
    }

    readonly [Symbol.toStringTag]: string;

    catch<TResult = never>(
        onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<AnimationStopReason | TResult> {
        return this.promise.catch(onrejected);
    }

    finally(onfinally?: (() => void) | undefined | null): Promise<AnimationStopReason> {
        return this.promise.finally(onfinally);
    }

    then<TResult1 = AnimationStopReason, TResult2 = never>(
        onfulfilled?: ((value: AnimationStopReason) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2> {
        return this.promise.then(onfulfilled, onrejected);
    }
}

const doAnimation = async (
    ped: number,
    animation: AnimationInfo,
    forceDuration: boolean,
    animationCanceller: AnimationCanceller
): Promise<AnimationStopReason> => {
    const duration = animation.duration
        ? animation.duration
        : forceDuration
        ? 1000
        : animation.options?.repeat
        ? -1
        : GetAnimDuration(animation.dictionary, animation.name) * 1000;

    const blendInSpeed = animation.blendInSpeed ? animation.blendInSpeed : 1;
    const blendOutSpeed = animation.blendOutSpeed ? animation.blendOutSpeed : 1;
    const flags = animationOptionsToFlags(animation.options || {});
    const playbackRate = animation.playbackRate ? animation.playbackRate : 0.0;
    const lockX = animation.lockX ? animation.lockX : false;
    const lockY = animation.lockY ? animation.lockY : false;
    const lockZ = animation.lockZ ? animation.lockZ : false;

    TaskPlayAnim(
        ped,
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

    // await for animation start
    await waitUntil(async () => IsEntityPlayingAnim(ped, animation.dictionary, animation.name, 3), 1000);

    const waitUntilPromise = waitUntil(async () => {
        return !IsEntityPlayingAnim(ped, animation.dictionary, animation.name, 3);
    });

    return new Promise<AnimationStopReason>(resolve => {
        if (duration > 0) {
            wait(duration).then(() => {
                resolve(AnimationStopReason.Finished);
            });
        }

        waitUntilPromise.then(() => {
            resolve(AnimationStopReason.Aborted);
        });

        animationCanceller.onCancel = reason => {
            resolve(reason);
        };
    }).then(reason => {
        if (!waitUntilPromise.isCanceled) {
            waitUntilPromise.cancel();
        }

        if (IsEntityPlayingAnim(ped, animation.dictionary, animation.name, 3)) {
            StopAnimTask(ped, animation.dictionary, animation.name, 3);
        }

        return reason;
    });
};

@Injectable()
export class AnimationFactory {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    public createAnimation(animation: Animation, options: Partial<PlayOptions> = {}): AnimationRunner {
        return this.createFromCallback(async (animationCanceller, ped) => {
            if (animation.enter?.dictionary) {
                await this.resourceLoader.loadAnimationDictionary(animation.enter.dictionary);
            }

            if (animation.base.dictionary) {
                await this.resourceLoader.loadAnimationDictionary(animation.base.dictionary);
            }

            if (animation.exit?.dictionary) {
                await this.resourceLoader.loadAnimationDictionary(animation.exit.dictionary);
            }

            const props = [];

            if (animation.props) {
                for (const prop of animation.props) {
                    await this.resourceLoader.loadModel(prop.model);

                    const playerOffset = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.0, 0.0) as Vector3;
                    const propId = CreateObject(
                        GetHashKey(prop.model),
                        playerOffset[0],
                        playerOffset[1],
                        playerOffset[2],
                        true,
                        true,
                        false
                    );

                    SetEntityAsMissionEntity(propId, true, true);
                    SetNetworkIdCanMigrate(NetworkGetNetworkIdFromEntity(propId), false);

                    AttachEntityToEntity(
                        propId,
                        ped,
                        GetPedBoneIndex(ped, prop.bone),
                        prop.position[0],
                        prop.position[1],
                        prop.position[2],
                        prop.rotation[0],
                        prop.rotation[1],
                        prop.rotation[2],
                        true,
                        true,
                        false,
                        true,
                        0,
                        true
                    );

                    props.push(propId);
                }
            }

            try {
                if (animation.enter) {
                    const stopReason = await doAnimation(ped, animation.enter, true, animationCanceller);

                    if (stopReason !== AnimationStopReason.Finished) {
                        return stopReason;
                    }
                }

                const stopReason = await doAnimation(ped, animation.base, false, animationCanceller);

                if (stopReason !== AnimationStopReason.Finished) {
                    return stopReason;
                }

                if (animation.exit) {
                    const stopReason = await doAnimation(ped, animation.exit, true, animationCanceller);

                    if (stopReason !== AnimationStopReason.Finished) {
                        return stopReason;
                    }
                }

                return AnimationStopReason.Finished;
            } finally {
                for (const prop of props) {
                    DetachEntity(prop, false, false);
                    DeleteEntity(prop);
                }
            }
        }, options);
    }

    public createScenario(scenario: Scenario, options: Partial<PlayOptions> = {}): AnimationRunner {
        return this.createFromCallback(async (animationCanceller, ped) => {
            if (scenario.fixPositionDelta) {
                const heading = GetEntityHeading(ped);
                const headingAdjusted = heading % 90;
                const position = GetEntityCoords(ped, false) as Vector3;
                const headingRad = (headingAdjusted * Math.PI) / 180;

                position[0] += scenario.fixPositionDelta[0] * Math.cos(headingRad);
                position[1] += scenario.fixPositionDelta[1] * Math.sin(headingRad);
                position[2] += scenario.fixPositionDelta[2];

                TaskStartScenarioAtPosition(
                    ped,
                    scenario.name,
                    position[0],
                    position[1],
                    position[2],
                    heading,
                    0,
                    true,
                    false
                );
            } else {
                TaskStartScenarioInPlace(ped, scenario.name, 0, true);
            }

            const until = async () => {
                return !IsPedUsingAnyScenario(ped) || !IsPedUsingScenario(ped, scenario.name);
            };

            const waitUntilPromise = waitUntil(until);
            const promise = new Promise<AnimationStopReason>(resolve => {
                if (scenario.duration > 0) {
                    wait(scenario.duration).then(() => {
                        resolve(AnimationStopReason.Finished);
                    });
                }

                waitUntilPromise.then(cancelled => {
                    if (cancelled) {
                        resolve(AnimationStopReason.Canceled);
                    } else {
                        if (scenario.duration > 0) {
                            resolve(AnimationStopReason.Aborted);
                        } else {
                            // we cannot determine if the scenario was aborted or finished, so we assume it was finished
                            resolve(AnimationStopReason.Finished);
                        }
                    }
                });

                animationCanceller.onCancel = reason => {
                    resolve(reason);
                };
            }).then(reason => {
                if (!waitUntilPromise.isCanceled) {
                    waitUntilPromise.cancel();
                }

                return reason;
            });

            return promise.finally(() => {
                if (IsPedUsingAnyScenario(ped)) {
                    TaskStartScenarioInPlace(ped, scenario.name, 0, false);
                }
            });
        }, options);
    }

    public createFromCallback(
        callback: (animationCanceller: AnimationCanceller, ped: number) => Promise<AnimationStopReason>,
        options: Partial<PlayOptions> = {}
    ): AnimationRunner {
        const playOptions = { ...defaultPlayOptions, ...options };

        if (!playOptions.ped) {
            playOptions.ped = PlayerPedId();
        }

        if (playOptions.clearTasksBefore) {
            ClearPedTasksImmediately(playOptions.ped);
            ClearPedSecondaryTask(playOptions.ped);
        }

        if (playOptions.resetWeapon) {
            SetCurrentPedWeapon(playOptions.ped, GetHashKey(WeaponName.UNARMED), true);
        }

        const animationCanceller = new AnimationCanceller();

        return new AnimationRunner(
            callback(animationCanceller, playOptions.ped).finally(() => {
                if (playOptions.clearTasksAfter) {
                    ClearPedTasks(playOptions.ped);
                    ClearPedSecondaryTask(playOptions.ped);
                }
            }),
            animationCanceller
        );
    }
}
