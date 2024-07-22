import { InventoryConfiguration, InventoryItem } from '../../shared/inventory';
import { Inject, Injectable } from '../decorators/injectable';
import { PlayerInventoryListenerMetadataKey } from '../decorators/player';
import { getMethodMetadata } from '../decorators/reflect';
import { Logger } from '../logger';

type Listener = (items: Record<number, InventoryItem>, configuration: InventoryConfiguration) => void | Promise<void>;

@Injectable()
export class PlayerInventoryLoader {
    @Inject(Logger)
    private logger: Logger;

    private listeners: Listener[] = [];

    public async trigger(items: Record<number, InventoryItem>, configuration: InventoryConfiguration): Promise<void> {
        const promises = [];

        for (const method of this.listeners) {
            promises.push(method(items, configuration));
        }

        await Promise.all(promises);
    }

    public load(provider): void {
        const repositoryMethodList = getMethodMetadata(PlayerInventoryListenerMetadataKey, provider);

        for (const methodName of Object.keys(repositoryMethodList)) {
            const method = provider[methodName].bind(provider);

            this.listeners.push(method);
        }
    }

    public unload(): void {
        this.listeners = [];
    }
}
