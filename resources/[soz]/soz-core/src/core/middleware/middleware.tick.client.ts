import { Inject, Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { ContextTickMiddlewareFactory } from './context.middleware';
import { LogMiddlewareFactory } from './log.middleware';
import { Middleware, MiddlewareTickFactory } from './middleware';

@Injectable()
export class ChainMiddlewareTickClientFactory implements MiddlewareTickFactory {
    @Inject(LogMiddlewareFactory)
    private logMiddlewareFactory: LogMiddlewareFactory;

    @Inject(ContextTickMiddlewareFactory)
    private contextTickMiddlewareFactory: ContextTickMiddlewareFactory;

    create(tick: TickMetadata, next: Middleware): Middleware {
        return this.logMiddlewareFactory.create(tick, this.contextTickMiddlewareFactory.create(tick, next));
    }
}
