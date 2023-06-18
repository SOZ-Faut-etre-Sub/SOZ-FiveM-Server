import { Context } from '../context';
import { EventMetadata } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { Middleware, MiddlewareFactory, MiddlewareTickFactory } from './middleware';

@Injectable()
export class ContextEventMiddlewareFactory implements MiddlewareFactory {
    public create(event: EventMetadata, next: Middleware): Middleware {
        return async (...args): Promise<void> => {
            const context = new Context(event.name + '_' + event.methodName, 'event');

            try {
                context.start();

                if (!event.context) {
                    return await next(...args);
                }

                return await next(context, ...args);
            } finally {
                context.stop();
            }
        };
    }
}

@Injectable()
export class ContextTickMiddlewareFactory implements MiddlewareTickFactory {
    public create(tick: TickMetadata, next: Middleware): Middleware {
        return async (...args): Promise<void> => {
            const context = new Context(tick.name, 'tick');

            try {
                context.start();

                if (!tick.context) {
                    return await next(...args);
                }

                return await next(context, ...args);
            } finally {
                context.stop();
            }
        };
    }
}
