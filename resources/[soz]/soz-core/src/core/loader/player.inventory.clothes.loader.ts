import { InventoryItem } from '../../shared/inventory';
import { Inject, Injectable } from '../decorators/injectable';
import { PlayerClothesInventoryListenerMetadataKey } from '../decorators/player';
import { getMethodMetadata } from '../decorators/reflect';
import { Logger } from '../logger';

type Listener = (items: Record<number, InventoryItem>) => void | Promise<void>;

@Injectable()
export class PlayerInventoryClothesLoader {
    @Inject(Logger)
    private logger: Logger;

    private listeners: Listener[] = [];

    public async trigger(items: Record<number, InventoryItem>): Promise<void> {
        const promises = [];

        for (const method of this.listeners) {
            promises.push(method(items));
        }

        await Promise.all(promises);
    }

    public load(provider): void {
        const repositoryMethodList = getMethodMetadata(PlayerClothesInventoryListenerMetadataKey, provider);

        for (const methodName of Object.keys(repositoryMethodList)) {
            const method = provider[methodName].bind(provider);

            this.listeners.push(method);
        }
    }

    public unload(): void {
        this.listeners = [];
    }
}
