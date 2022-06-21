import { Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { TickMetadataKey } from '../decorators/tick';

@Injectable()
export class TickLoader {
    private ticks = [];

    public load(provider): void {
        const tickMethodList = getMethodMetadata<number>(TickMetadataKey, provider);

        for (const methodName of Object.keys(tickMethodList)) {
            const interval = tickMethodList[methodName];
            const method = provider[methodName].bind(provider);

            const tick = setTick(async () => {
                const result = await method();

                if (result === false) {
                    clearTick(tick);
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, interval));
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
