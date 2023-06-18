import { EventMetadata } from '../decorators/event';
import { Inject, Injectable } from '../decorators/injectable';
import { ContextEventMiddlewareFactory } from './context.middleware';
import { Middleware, MiddlewareFactory } from './middleware';

@Injectable()
export class ChainMiddlewareEventClientFactory implements MiddlewareFactory {
    @Inject(ContextEventMiddlewareFactory)
    private contextEventMiddlewareFactory: ContextEventMiddlewareFactory;

    create(event: EventMetadata, next: Middleware): Middleware {
        return this.contextEventMiddlewareFactory.create(event, next);
    }
}
