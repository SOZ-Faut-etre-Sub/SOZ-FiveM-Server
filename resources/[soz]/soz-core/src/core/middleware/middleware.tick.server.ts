import { Inject, Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { MetricTickMiddlewareFactory } from './metric.tick.middleware';
import { Middleware, MiddlewareTickFactory } from './middleware';
import { ProfilerTickMiddlewareFactory } from './profiler.middleware';

@Injectable()
export class ChainMiddlewareTickServerFactory implements MiddlewareTickFactory {
    @Inject(MetricTickMiddlewareFactory)
    private metricMiddlewareFactory: MetricTickMiddlewareFactory;

    @Inject(ProfilerTickMiddlewareFactory)
    private profilerTickMiddlewareFactory: ProfilerTickMiddlewareFactory;

    create(tick: TickMetadata, next: Middleware): Middleware {
        return this.metricMiddlewareFactory.create(tick, this.profilerTickMiddlewareFactory.create(tick, next));
    }
}
