import { Histogram } from 'prom-client';

import { EventMetadata } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { Middleware, MiddlewareFactory } from './middleware';

@Injectable()
export class MetricMiddlewareFactory implements MiddlewareFactory {
    private eventHistogram: Histogram<string>;

    public constructor() {
        this.eventHistogram = new Histogram({
            name: 'soz_core_event',
            help: 'Event execution histogram',
            labelNames: ['event'],
        });
    }

    public create(event: EventMetadata, next: Middleware): Middleware {
        return async (...args): Promise<void> => {
            const end = this.eventHistogram.startTimer({
                event: event.name,
            });

            const result = await next(...args);

            end();

            return result;
        };
    }
}
