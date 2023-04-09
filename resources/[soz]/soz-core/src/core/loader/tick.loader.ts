import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { TickMetadata, TickMetadataKey } from '../decorators/tick';
import { MiddlewareTickFactory } from '../middleware/middleware';
import { wait } from '../utils';

@Injectable()
export class TickLoader {
    private ticks = [];

    @Inject('MiddlewareTickFactory')
    private middlewareFactory: MiddlewareTickFactory;

    public load(provider): void {
        const tickMethodList = getMethodMetadata<TickMetadata>(TickMetadataKey, provider);

        for (const methodName of Object.keys(tickMethodList)) {
            const metadata = tickMethodList[methodName];
            const method = provider[methodName].bind(provider);
            const methodWithMiddleware = this.middlewareFactory.create(metadata, method);

            const tick = setTick(async () => {
                try {
                    const result = await methodWithMiddleware();

                    if (result === false) {
                        clearTick(tick);
                        return;
                    }
                } catch (error) {
                    console.error(`Error in ${metadata.name}`, error);
                }

                if (metadata.interval > 0) {
                    await wait(metadata.interval);
                }
            });

            this.ticks.push(tick);
        }
    }

    public unload(): void {
        for (const tick of this.ticks) {
            clearTick(tick);
        }

        this.ticks = [];
    }
}
