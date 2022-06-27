import { OnceMetadataKey, OnceStep } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';

@Injectable()
export class OnceLoader {
    private methods: Record<OnceStep, any[]> = {
        [OnceStep.Start]: [],
        [OnceStep.DatabaseConnected]: [],
        [OnceStep.PlayerLoaded]: [],
    };

    public trigger(step: OnceStep, ...args): void {
        for (const method of this.methods[step]) {
            method(...args);
        }
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
        this.methods = { [OnceStep.Start]: [], [OnceStep.PlayerLoaded]: [] };
    }
}
