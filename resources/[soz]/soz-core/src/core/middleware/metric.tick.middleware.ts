import { Histogram } from 'prom-client';

import { Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { Middleware, MiddlewareTickFactory } from './middleware';

@Injectable()
export class MetricTickMiddlewareFactory implements MiddlewareTickFactory {
    private tickHistogram: Histogram<string> = new Histogram({
        name: 'soz_core_tick',
        help: 'Tick execution histogram',
        labelNames: ['tick'],
    });

    public create(tick: TickMetadata, next: Middleware): Middleware {
        return async (...args): Promise<void> => {
            const end = this.tickHistogram.startTimer({
                tick: tick.name,
            });

            const result = await next(...args);

            end();

            return result;
        };
    }
}
