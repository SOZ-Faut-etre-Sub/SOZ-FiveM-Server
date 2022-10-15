import { Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { TickMetadataKey } from '../decorators/tick';
import { wait } from '../utils';

@Injectable()
export class TickLoader {
    private ticks = [];

    public load(provider): void {
        const tickMethodList = getMethodMetadata<number>(TickMetadataKey, provider);

        for (const methodName of Object.keys(tickMethodList)) {
            const interval = tickMethodList[methodName];
            const method = provider[methodName].bind(provider);

            const tick = setTick(async () => {
                try {
                    const result = await method();

                    if (result === false) {
                        clearTick(tick);
                        return;
                    }

                    if (interval > 0) {
                        await wait(interval);
                    }
                } catch (error) {
                    console.error(`Error in ${provider.toString()}:${methodName}`, error);
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
