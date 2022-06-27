import { SOZ_CORE_IS_SERVER } from '../../globals';
import { EventMetadata } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { Middleware, MiddlewareFactory } from './middleware';

@Injectable()
export class SourceMiddlewareFactory implements MiddlewareFactory {
    public create(event: EventMetadata, next: Middleware): Middleware {
        if (SOZ_CORE_IS_SERVER) {
            return (...args): void | Promise<any> => {
                if (event.net) {
                    const source = (global as any).source as number;

                    return next(source, ...args);
                }

                return next(...args);
            };
        } else {
            return next;
        }
    }
}
