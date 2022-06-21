import { EventMetadata, EventMetadataKey } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';

@Injectable()
export class EventLoader {
    private events: Record<string, any[]> = {};

    public load(provider): void {
        const eventMethodList = getMethodMetadata<EventMetadata[]>(EventMetadataKey, provider);

        for (const methodName of Object.keys(eventMethodList)) {
            const eventMetadataList = eventMethodList[methodName];
            const method = provider[methodName].bind(provider);

            for (const eventMetadata of eventMetadataList) {
                if (!this.events[eventMetadata.name]) {
                    this.events[eventMetadata.name] = [];
                }

                // @TODO: Add middleware system for event
                addEventListener(eventMetadata.name, method, eventMetadata.net);
                this.events[eventMetadata.name].push(method);
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
