import { EventMetadata } from '../decorators/event';
import { Inject, Injectable } from '../decorators/injectable';
import { ContextEventMiddlewareFactory } from './context.middleware';
import { LogMiddlewareFactory } from './log.middleware';
import { Middleware, MiddlewareFactory } from './middleware';

@Injectable()
export class ChainMiddlewareEventClientFactory implements MiddlewareFactory {
    @Inject(LogMiddlewareFactory)
    private logMiddlewareFactory: LogMiddlewareFactory;

    @Inject(ContextEventMiddlewareFactory)
    private contextEventMiddlewareFactory: ContextEventMiddlewareFactory;

    create(event: EventMetadata, next: Middleware): Middleware {
        return this.logMiddlewareFactory.create(event, this.contextEventMiddlewareFactory.create(event, next));
    }
}
