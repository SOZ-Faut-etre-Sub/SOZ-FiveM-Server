import { EventMetadata } from '../decorators/event';
import { Inject, Injectable } from '../decorators/injectable';
import { LogMiddlewareFactory } from './log.middleware';
import { MetricMiddlewareFactory } from './metric.middleware';
import { Middleware, MiddlewareFactory } from './middleware';
import { SourceMiddlewareFactory } from './source.middleware';

@Injectable()
export class ChainMiddlewareEventServerFactory implements MiddlewareFactory {
    @Inject(LogMiddlewareFactory)
    private logMiddlewareFactory: LogMiddlewareFactory;

    @Inject(MetricMiddlewareFactory)
    private metricMiddlewareFactory: MetricMiddlewareFactory;

    @Inject(SourceMiddlewareFactory)
    private sourceMiddlewareFactory: SourceMiddlewareFactory;

    create(event: EventMetadata, next: Middleware): Middleware {
        return this.logMiddlewareFactory.create(
            event,
            this.metricMiddlewareFactory.create(event, this.sourceMiddlewareFactory.create(event, next))
        );
    }
}
