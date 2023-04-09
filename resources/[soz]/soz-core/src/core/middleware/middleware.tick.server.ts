import { Inject, Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { MetricTickMiddlewareFactory } from './metric.tick.middleware';
import { Middleware, MiddlewareTickFactory } from './middleware';

@Injectable()
export class ChainMiddlewareTickServerFactory implements MiddlewareTickFactory {
    @Inject(MetricTickMiddlewareFactory)
    private metricMiddlewareFactory: MetricTickMiddlewareFactory;

    create(tick: TickMetadata, next: Middleware): Middleware {
        return this.metricMiddlewareFactory.create(tick, next);
    }
}
