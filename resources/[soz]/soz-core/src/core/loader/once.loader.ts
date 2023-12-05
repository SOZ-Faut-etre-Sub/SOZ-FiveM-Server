import { Logger } from '@core/logger';

import { OnceMetadata, OnceMetadataKey, OnceStep } from '../decorators/event';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';

type MethodTrigger = {
    method: any;
    reload: boolean;
};

@Injectable()
export class OnceLoader {
    @Inject(Logger)
    private logger: Logger;

    private methods: Record<OnceStep, MethodTrigger[]> = {
        [OnceStep.Start]: [],
        [OnceStep.DatabaseConnected]: [],
        [OnceStep.PlayerLoaded]: [],
        [OnceStep.RepositoriesLoaded]: [],
        [OnceStep.Stop]: [],
        [OnceStep.NuiLoaded]: [],
    };

    private triggerred = new Set<OnceStep>();

    public async trigger(step: OnceStep, ...args): Promise<void> {
        const reload = this.triggerred.has(step);
        const promises = [];

        for (const method of this.methods[step]) {
            if (!reload || method.reload) {
                promises.push(method.method(step, ...args));
            }
        }

        this.triggerred.add(step);

        await Promise.all(promises);
    }

    public load(provider): void {
        const eventMethodList = getMethodMetadata<OnceMetadata>(OnceMetadataKey, provider);

        for (const methodName of Object.keys(eventMethodList)) {
            const onceStep = eventMethodList[methodName];
            const method = provider[methodName].bind(provider);
            const decoratedMethod = async (step: OnceStep, ...args) => {
                try {
                    await method(...args);
                } catch (e) {
                    this.logger.error(
                        `Error on executing step ${step} in method ${methodName} of provider ${provider.constructor.name}`,
                        e
                    );
                }
            };

            this.methods[onceStep.step].push({
                method: decoratedMethod,
                reload: onceStep.reload,
            });
        }
    }

    public unload(): void {
        this.methods = {
            [OnceStep.Start]: [],
            [OnceStep.DatabaseConnected]: [],
            [OnceStep.PlayerLoaded]: [],
            [OnceStep.RepositoriesLoaded]: [],
            [OnceStep.Stop]: [],
            [OnceStep.NuiLoaded]: [],
        };
    }
}
