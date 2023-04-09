import { EventMetadata } from '../decorators/event';
import { TickMetadata } from '../decorators/tick';

export type Middleware = (...args: any[]) => any | Promise<any>;

export interface MiddlewareFactory {
    create(event: EventMetadata, next: Middleware): Middleware;
}

export interface MiddlewareTickFactory {
    create(tick: TickMetadata, next: Middleware): Middleware;
}
