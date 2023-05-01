import { EventMetadata } from '../decorators/event';
import { Inject, Injectable } from '../decorators/injectable';
import { Middleware, MiddlewareFactory } from './middleware';
import { ProfilerMiddlewareFactory } from './profiler.middleware';

@Injectable()
export class ChainMiddlewareEventClientFactory implements MiddlewareFactory {
    @Inject(ProfilerMiddlewareFactory)
    private profilerMiddlewareFactory: ProfilerMiddlewareFactory;

    create(event: EventMetadata, next: Middleware): Middleware {
        return this.profilerMiddlewareFactory.create(event, next);
    }
}
