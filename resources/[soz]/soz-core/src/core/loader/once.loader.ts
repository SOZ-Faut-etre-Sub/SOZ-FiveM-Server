import { OnceMetadataKey, OnceStep } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';

@Injectable()
export class OnceLoader {
    private methods: Record<OnceStep, any[]> = {
        [OnceStep.Start]: [],
        [OnceStep.DatabaseConnected]: [],
        [OnceStep.PlayerLoaded]: [],
        [OnceStep.RepositoriesLoaded]: [],
        [OnceStep.Stop]: [],
    };

    public async trigger(step: OnceStep, ...args): Promise<void> {
        const promises = [];

        for (const method of this.methods[step]) {
            promises.push(method(...args));
        }

        await Promise.all(promises);
    }

    public load(provider): void {
        const eventMethodList = getMethodMetadata<OnceStep>(OnceMetadataKey, provider);

        for (const methodName of Object.keys(eventMethodList)) {
            const onceStep = eventMethodList[methodName];
            const method = provider[methodName].bind(provider);

            this.methods[onceStep].push(method);
        }
    }

    public unload(): void {
        this.methods = {
            [OnceStep.Start]: [],
            [OnceStep.DatabaseConnected]: [],
            [OnceStep.PlayerLoaded]: [],
            [OnceStep.RepositoriesLoaded]: [],
            [OnceStep.Stop]: [],
        };
    }
}
