import { EventMetadata } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { Middleware, MiddlewareFactory } from './middleware';

@Injectable()
export class MetricMiddlewareFactory implements MiddlewareFactory {
    private callsNumber: Record<string, number> = {};
    private executionTime: Record<string, number> = {};

    public create(event: EventMetadata, next: Middleware): Middleware {
        if (this.callsNumber[event.name] === undefined) {
            this.callsNumber[event.name] = 0;
        }

        if (this.executionTime[event.name] === undefined) {
            this.executionTime[event.name] = 0;
        }

        return async (...args): Promise<void> => {
            this.callsNumber[event.name]++;
            const start = Date.now();

            const result = await next(...args);

            const duration = Date.now() - start;
            this.executionTime[event.name] += duration;

            return result;
        };
    }
}
