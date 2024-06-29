import { Inject, Injectable } from '@core/decorators/injectable';
import { wait, waitUntil } from '@core/utils';
import { ServerEvent } from '@public/shared/event';

import {
    Animation,
    AnimationInfo,
    animationOptionsToFlags,
    AnimationProps,
    AnimationStopReason,
    PlayOptions,
    Scenario,
} from '../../shared/animation';
import { transformForwardPoint2D, Vector2, Vector3 } from '../../shared/polyzone/vector';
import { WeaponName } from '../../shared/weapons/weapon';
import { AttachedObjectService } from '../object/attached.object.service';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../repository/resource.loader';

const defaultPlayOptions: PlayOptions = {
    ped: null,
    resetWeapon: false,
    clearTasksBefore: false,
    clearTasksAfter: false,
    cancellable: true,
};

class AnimationCanceller {
    public cancelReason: AnimationStopReason = null;

    public onCancel: (reason: AnimationStopReason) => void = () => {};

    public cancel(reason: AnimationStopReason): void {
        this.cancelReason = reason;
        this.onCancel(reason);
    }
}

const fixPositionOffset = (position: Vector3, heading: number, delta: Vector2): Vector3 => {
    const headingInRad = (heading * Math.PI) / 180;

    const [x, y] = transformForwardPoint2D([position[0], position[1]], headingInRad, delta[0]);
    const z = position[2] + delta[1];

    return [x, y, z];
};

export class AnimationRunner implements Promise<AnimationStopReason> {
    public running = true;

    private static seq = 0;

    readonly id = AnimationRunner.seq++;

    readonly cancellable: boolean;

    private readonly promise: Promise<AnimationStopReason>;

    private animationCanceller: AnimationCanceller;

    constructor(
        innerPromise: Promise<AnimationStopReason>,
        animationCanceller: AnimationCanceller,
        cancellable: boolean
    ) {
        this.promise = new Promise((resolve, reject) => {
            innerPromise
                .then(
                    r => resolve(r),
                    e => reject(e)
                )
                .finally(() => (this.running = false));
        });

        this.animationCanceller = animationCanceller;
        this.cancellable = cancellable;
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

    const blendInSpeed = animation.blendInSpeed ? animation.blendInSpeed : 8.0;
    const blendOutSpeed = animation.blendOutSpeed ? animation.blendOutSpeed : -8.0;
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
        -1, // always loop, if there is a duration we will stop it manually, so we are sure than animation is always longer than the duration even on slow machines
        flags,
        playbackRate,
        lockX,
        lockY,
        lockZ
    );

    // await for animation start
    await waitUntil(async () => IsEntityPlayingAnim(ped, animation.dictionary, animation.name, 3), 1000);

    const waitUntilPromise = waitUntil(async () => {
        return !IsEntityPlayingAnim(ped, animation.dictionary, animation.name, 3) || IsPedRagdoll(ped);
    });

    return new Promise<AnimationStopReason>(resolve => {
        if (duration > 0) {
            wait(duration).then(() => {
                resolve(AnimationStopReason.Finished);
            });
        }

        waitUntilPromise.then(() => {
            setTimeout(() => {
                resolve(AnimationStopReason.Aborted);
            }, 200);
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

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(AttachedObjectService)
    private attachedObjectService: AttachedObjectService;

    public createAnimation(animation: Animation, options: Partial<PlayOptions> = {}): AnimationRunner {
        return this.createFromCallback(async (animationCanceller, ped) => {
            if (IsPedRagdoll(ped)) {
                return AnimationStopReason.Aborted;
            }

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
                    const propId = await this.attachedObjectService.attachObjectToPlayer({
                        bone: prop.bone,
                        model: prop.model,
                        position: prop.position,
                        rotation: prop.rotation,
                    });

                    if (prop.fx) {
                        this.fxLoop(propId, prop);
                    }

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

                if (stopReason === AnimationStopReason.Aborted) {
                    return stopReason;
                }

                if (animation.exit) {
                    const stopReason = await doAnimation(ped, animation.exit, true, animationCanceller);

                    if (stopReason !== AnimationStopReason.Finished) {
                        return stopReason;
                    }
                }

                return stopReason;
            } finally {
                for (const prop of props) {
                    if (animation.enter?.dictionary) {
                        this.resourceLoader.unloadAnimationDictionary(animation.enter.dictionary);
                    }

                    this.resourceLoader.unloadAnimationDictionary(animation.base.dictionary);

                    if (animation.exit?.dictionary) {
                        this.resourceLoader.unloadAnimationDictionary(animation.exit.dictionary);
                    }

                    RemoveParticleFxFromEntity(prop);
                    this.attachedObjectService.detachObjectToPlayer(prop);
                }
            }
        }, options);
    }

    private async fxLoop(entity: number, prop: AnimationProps) {
        if (prop.fx.delay) {
            await wait(prop.fx.delay);
        }
        let index = 0;
        do {
            UseParticleFxAsset(prop.fx.dictionary);
            StartParticleFxLoopedOnEntity(
                prop.fx.name,
                entity,
                prop.fx.position[0],
                prop.fx.position[1],
                prop.fx.position[2],
                prop.fx.rotation[0],
                prop.fx.rotation[1],
                prop.fx.rotation[2],
                prop.fx.scale,
                false,
                false,
                false
            );

            if (prop.fx.net) {
                const playerPedId = PlayerPedId();
                const coords = GetEntityCoords(playerPedId) as Vector3;
                const playersInrange = this.playerService.getPlayersAround(coords, 100.0, true);
                if (playersInrange.length) {
                    TriggerServerEvent(ServerEvent.ANIMATION_FX, ObjToNet(entity), prop.fx, playersInrange);
                }
            }

            if (prop.fx.manualLoop && prop.fx.duration) {
                await wait(prop.fx.duration[index++ % prop.fx.duration.length]);
            }
        } while (prop.fx.manualLoop && DoesEntityExist(entity));
    }

    public createScenario(scenario: Scenario, options: Partial<PlayOptions> = {}): AnimationRunner {
        return this.createFromCallback(async (animationCanceller, ped) => {
            // If we launch over an existing scenario, we need to cancel it first
            if (IsPedUsingAnyScenario(ped)) {
                ClearPedTasks(ped);

                await waitUntil(
                    async () => !IsPedUsingAnyScenario(ped) || animationCanceller.cancelReason !== null,
                    1000
                );
            }

            // Check if cancelled while waiting for previous scenario to stop
            if (animationCanceller.cancelReason !== null) {
                return animationCanceller.cancelReason;
            }

            // Fix position for some scenarios
            if (scenario.fixPositionDelta) {
                const heading = GetEntityHeading(ped);
                const position = GetEntityCoords(ped, false) as Vector3;
                const scenarioPosition = fixPositionOffset(position, heading, scenario.fixPositionDelta);

                TaskStartScenarioAtPosition(
                    ped,
                    scenario.name,
                    scenarioPosition[0],
                    scenarioPosition[1],
                    scenarioPosition[2],
                    heading,
                    0,
                    true,
                    false
                );
            } else if (scenario.position) {
                TaskStartScenarioAtPosition(
                    ped,
                    scenario.name,
                    scenario.position[0],
                    scenario.position[1],
                    scenario.position[2],
                    scenario.position[3],
                    0,
                    scenario.isSittingScenario ?? false,
                    scenario.shouldTeleport ?? false
                );
            } else {
                TaskStartScenarioInPlace(ped, scenario.name, -1, true);
            }

            // Wait for scenario to start
            await waitUntil(async () => IsPedUsingAnyScenario(ped) && IsPedUsingScenario(ped, scenario.name), 1000);

            // Promise that resolves when the scenario is finished
            const waitUntilPromise = waitUntil(async () => {
                return !IsPedUsingAnyScenario(ped) || !IsPedUsingScenario(ped, scenario.name);
            });

            // Promise that resolves when the scenario is cancelled, aborted or finished
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

            promise.finally(() => {
                if (IsPedUsingAnyScenario(ped) && IsPedUsingScenario(ped, scenario.name)) {
                    ClearPedTasks(ped);
                }

                if (scenario.propsCreated) {
                    const position = GetEntityCoords(ped, false) as Vector3;

                    for (const prop of scenario.propsCreated) {
                        const hash = GetHashKey(prop);
                        const propId = GetClosestObjectOfType(
                            position[0],
                            position[1],
                            position[2],
                            1.0,
                            hash,
                            false,
                            true,
                            true
                        );

                        if (propId !== 0) {
                            SetEntityAsMissionEntity(propId, false, false);
                            DetachEntity(propId, false, false);
                            DeleteObject(propId);
                        }
                    }
                }
            });

            return promise;
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
            animationCanceller,
            playOptions.cancellable
        );
    }
}
