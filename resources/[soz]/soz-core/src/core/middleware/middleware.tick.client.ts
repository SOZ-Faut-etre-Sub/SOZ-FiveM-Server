import { Inject, Injectable } from '../decorators/injectable';
import { TickMetadata } from '../decorators/tick';
import { Middleware, MiddlewareTickFactory } from './middleware';
import { ProfilerTickMiddlewareFactory } from './profiler.middleware';

@Injectable()
export class ChainMiddlewareTickClientFactory implements MiddlewareTickFactory {
    @Inject(ProfilerTickMiddlewareFactory)
    private profilerTickMiddlewareFactory: ProfilerTickMiddlewareFactory;

    create(tick: TickMetadata, next: Middleware): Middleware {
        return this.profilerTickMiddlewareFactory.create(tick, next);
    }
}
