import { Injectable } from '../core/decorators/injectable';

type ProgressOptions = {
    useWhileDead: boolean;
    canCancel: boolean;
    disableCombat: boolean;
};

type ProgressAnimation = {
    dictionary: string;
    name: string;
    flags: number;
};

type ProgressResult = {
    completed: boolean;
    progress: number;
};

type ProgressProp = {
    model: string;
    bone: number;
    coords: { x: number; y: number; z: number };
};

@Injectable()
export class ProgressService {
    public async progress(
        name: string,
        label: string,
        duration: number,
        animation: ProgressAnimation,
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
        let promiseResolve, promiseReject;
        const promise = new Promise<ProgressResult>(function (resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
        });

        exports['prgressnar'].Progress(
            {
                name: name.toLowerCase(),
                duration,
                label,
                useWhileDead: options.useWhileDead,
                canCancel: options.canCancel,
                controlDisables: {
                    disableCombat: options.disableCombat,
                },
                animation: {
                    animDict: animation.dictionary,
                    anim: animation.name,
                    flags: animation.flags || 0,
                },
                prop: {},
                propTwo: {},
            },
            (cancelled: boolean) => {
                if (cancelled) {
                    const elapsedBeforeCancel = Math.round((GetGameTimer() - start) / duration);

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
