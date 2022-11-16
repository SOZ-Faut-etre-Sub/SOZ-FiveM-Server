import PCancelable from 'p-cancelable';

import { Injectable } from '../core/decorators/injectable';
import { wait } from '../core/utils';
import { animationOptionsToFlags, ProgressAnimation, ProgressOptions, ProgressResult } from '../shared/progress';

@Injectable()
export class ProgressService {
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

        if (options.headingEntity) {
            TaskTurnPedToFaceEntity(PlayerPedId(), options.headingEntity.entity, 1000);
            await wait(1000);

            if (options.headingEntity.heading !== 0) {
                const heading = GetEntityHeading(PlayerPedId());
                SetEntityHeading(PlayerPedId(), (heading + options.headingEntity.heading) % 360);
            }
        }

        duration = exports['soz-upw'].CalculateDuration(duration);

        const start = GetGameTimer();
        let promiseResolve;
        const promise = new PCancelable<ProgressResult>(function (resolve, reject, onCancel) {
            promiseResolve = resolve;

            onCancel(() => {
                TriggerEvent('progressbar:client:cancel');
            });
        });

        exports['progressbar'].Progress(
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
            },
            (cancelled: boolean) => {
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
}
