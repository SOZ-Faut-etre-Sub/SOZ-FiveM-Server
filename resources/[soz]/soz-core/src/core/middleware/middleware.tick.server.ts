import { Inject, Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { ContextTickMiddlewareFactory } from './context.middleware';
import { MetricTickMiddlewareFactory } from './metric.tick.middleware';
import { Middleware, MiddlewareTickFactory } from './middleware';

@Injectable()
export class ChainMiddlewareTickServerFactory implements MiddlewareTickFactory {
    @Inject(MetricTickMiddlewareFactory)
    private metricMiddlewareFactory: MetricTickMiddlewareFactory;

    @Inject(ContextTickMiddlewareFactory)
    private contextTickMiddlewareFactory: ContextTickMiddlewareFactory;

    create(tick: TickMetadata, next: Middleware): Middleware {
        return this.metricMiddlewareFactory.create(tick, this.contextTickMiddlewareFactory.create(tick, next));
    }
}
