import { Injectable } from '../core/decorators/injectable';
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

        duration = exports['soz-upw'].CalculateDuration(duration);

        const start = GetGameTimer();
        let promiseResolve;
        const promise = new Promise<ProgressResult>(function (resolve) {
            promiseResolve = resolve;
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
}
