import { SOZ_CORE_IS_CLIENT } from '../../globals';
import { EventMetadata, EventMetadataKey, GameEventMetadataKey, NuiEventMetadataKey } from '../decorators/event';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { ChaineMiddlewareFactory } from '../middleware/middleware';

type GameEventCallback = (...args: any[]) => void;

@Injectable()
export class EventLoader {
    private events: Record<string, any[]> = {};

    private nuiEvents: Record<string, any[]> = {};

    private gameEvents: Record<string, GameEventCallback[]> = {};

    @Inject(ChaineMiddlewareFactory)
    private middlewareFactory: ChaineMiddlewareFactory;

    public constructor() {
        if (SOZ_CORE_IS_CLIENT) {
            addEventListener('gameEventTriggered', this.handleGameEvent.bind(this));
        }
    }

    private handleGameEvent(eventName: string, args: any[]): void {
        if (this.gameEvents[eventName]) {
            for (const method of this.gameEvents[eventName]) {
                method(...args);
            }
        }
    }

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

                addEventListener(eventMetadata.name, methodWithMiddleware, eventMetadata.net);
                this.events[eventMetadata.name].push(methodWithMiddleware);
            }
        }

        if (SOZ_CORE_IS_CLIENT) {
            const gameEventMethodList = getMethodMetadata<EventMetadata[]>(GameEventMetadataKey, provider);

            for (const methodName of Object.keys(gameEventMethodList)) {
                const gameEventMetadataList = gameEventMethodList[methodName];
                const method = provider[methodName].bind(provider);

                for (const gameEventMetadata of gameEventMetadataList) {
                    if (!this.gameEvents[gameEventMetadata.name]) {
                        this.gameEvents[gameEventMetadata.name] = [];
                    }

                    const methodWithMiddleware = this.middlewareFactory.create(gameEventMetadata, method);
                    this.gameEvents[gameEventMetadata.name].push(methodWithMiddleware);
                }
            }

            const nuiEventMethodList = getMethodMetadata<EventMetadata[]>(NuiEventMetadataKey, provider);

            for (const methodName of Object.keys(nuiEventMethodList)) {
                const nuiEventMetadataList = nuiEventMethodList[methodName];
                const method = provider[methodName].bind(provider);

                for (const nuiEventMetadata of nuiEventMetadataList) {
                    const nuiEventName = `__cfx_nui:${nuiEventMetadata.name}`;

                    if (!this.events[nuiEventName]) {
                        this.events[nuiEventName] = [];
                    }

                    const methodWithMiddleware = this.middlewareFactory.create(nuiEventMetadata, method);
                    const methodWithNuiCallback = async (data: any, callback: (response: any) => void) => {
                        callback(await methodWithMiddleware(data));
                    };

                    RegisterNuiCallbackType(nuiEventMetadata.name);
                    addEventListener(nuiEventName, methodWithNuiCallback);
                    this.events[nuiEventName].push(methodWithNuiCallback);
                }
            }
        }
    }

    public unload(): void {
        for (const event of Object.keys(this.events)) {
            for (const method of this.events[event]) {
                removeEventListener(event, method);
            }
        }

        if (SOZ_CORE_IS_CLIENT) {
            removeEventListener('gameEventTriggered', this.handleGameEvent);

            for (const event of Object.keys(this.nuiEvents)) {
                for (const method of this.nuiEvents[event]) {
                    removeEventListener(event, method);
                }
            }
        }

        this.events = {};
        this.gameEvents = {};
        this.nuiEvents = {};
    }
}
