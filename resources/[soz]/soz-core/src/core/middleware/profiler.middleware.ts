import * as async_hooks from 'async_hooks';

import { EventMetadata } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { Middleware, MiddlewareFactory, MiddlewareTickFactory } from './middleware';

@Injectable()
export class ProfilerMiddlewareFactory implements MiddlewareFactory {
    public create(event: EventMetadata, next: Middleware): Middleware {
        return async (...args): Promise<void> => {
            ProfilerEnterScope(`[soz-core] event: ${event.name}`);

            const promise = next(...args);

            ProfilerExitScope();

            return await promise;
        };
    }
}

@Injectable()
export class ProfilerTickMiddlewareFactory implements MiddlewareTickFactory {
    public create(tick: TickMetadata, next: Middleware): Middleware {
        return async (...args): Promise<void> => {
            ProfilerEnterScope(`[soz-core] tick: ${tick.name} (${tick.interval}ms)`);

            const promise = next(...args);

            ProfilerExitScope();

            return await promise;
        };
    }
}
