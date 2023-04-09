import { Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { Middleware, MiddlewareTickFactory } from './middleware';

@Injectable()
export class ChainMiddlewareTickClientFactory implements MiddlewareTickFactory {
    create(tick: TickMetadata, next: Middleware): Middleware {
        return next;
    }
}
