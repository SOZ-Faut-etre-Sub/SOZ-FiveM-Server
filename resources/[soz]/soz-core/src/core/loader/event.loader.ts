import { EventMetadata, EventMetadataKey } from '../decorators/event';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { ChaineMiddlewareFactory } from '../middleware/middleware';

@Injectable()
export class EventLoader {
    private events: Record<string, any[]> = {};

    @Inject(ChaineMiddlewareFactory)
    private middlewareFactory: ChaineMiddlewareFactory;

    public load(provider): void {
        const eventMethodList = getMethodMetadata<EventMetadata[]>(EventMetadataKey, provider);
        for (const methodName of Object.keys(eventMethodList)) {
            const eventMetadataList = eventMethodList[methodName];
            const method = provider[methodName].bind(provider);

            for (const eventMetadata of eventMetadataList) {
                if (!this.events[eventMetadata.name]) {
                    this.events[eventMetadata.name] = [];
                }

                const methodWithMiddleware = this.middlewareFactory.create(eventMetadata, method);

                // @TODO: Add middleware system for event
                addEventListener(eventMetadata.name, methodWithMiddleware, eventMetadata.net);
                this.events[eventMetadata.name].push(methodWithMiddleware);
            }
        }
    }

    public unload(): void {
        for (const event of Object.keys(this.events)) {
            for (const method of this.events[event]) {
                removeEventListener(event, method);
            }
        }

        this.events = {};
    }
}
