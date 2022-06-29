import { Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { StateBagHandlerMetadata, StateBagHandlerMetadataKey } from '../decorators/state';

@Injectable()
export class StateBagLoader {
    private handlers: number[] = [];

    public load(provider): void {
        const stateMethodList = getMethodMetadata<StateBagHandlerMetadata[]>(StateBagHandlerMetadataKey, provider);

        for (const methodName of Object.keys(stateMethodList)) {
            const stateMetadataList = stateMethodList[methodName];
            const method = provider[methodName].bind(provider);

            for (const stateMetadata of stateMetadataList) {
                // @TODO: Add middleware system for state
                this.handlers.push(AddStateBagChangeHandler(stateMetadata.key, stateMetadata.bag, method));
            }
        }
    }

    public unload(): void {
        for (const ref of this.handlers) {
            RemoveStateBagChangeHandler(ref);
        }

        this.handlers = [];
    }
}
