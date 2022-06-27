import { EventMetadata } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { Middleware, MiddlewareFactory } from './middleware';

@Injectable()
export class LogMiddlewareFactory implements MiddlewareFactory {
    public create(event: EventMetadata, next: Middleware): Middleware {
        return (...args): void | Promise<any> => {
            return next(...args);
        };
    }
}
