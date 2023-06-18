import { Inject, Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { ContextTickMiddlewareFactory } from './context.middleware';
import { Middleware, MiddlewareTickFactory } from './middleware';

@Injectable()
export class ChainMiddlewareTickClientFactory implements MiddlewareTickFactory {
    @Inject(ContextTickMiddlewareFactory)
    private contextTickMiddlewareFactory: ContextTickMiddlewareFactory;

    create(tick: TickMetadata, next: Middleware): Middleware {
        return this.contextTickMiddlewareFactory.create(tick, next);
    }
}
