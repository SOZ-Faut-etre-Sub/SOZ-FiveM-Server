import { EventMetadata } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { Middleware, MiddlewareFactory } from './middleware';

@Injectable()
export class ChainMiddlewareEventClientFactory implements MiddlewareFactory {
    create(event: EventMetadata, next: Middleware): Middleware {
        return next;
    }
}
