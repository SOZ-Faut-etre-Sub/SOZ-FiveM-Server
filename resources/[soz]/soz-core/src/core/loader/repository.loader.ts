import { RepositoryMapping } from '../../shared/repository';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import {
    RepositoryListenerMetadata,
    RepositoryListenerMetadataKey,
    RepositoryListenerType,
} from '../decorators/repository';
import { Logger } from '../logger';

type Listener = (data) => void | Promise<void>;

@Injectable()
export class RepositoryLoader {
    @Inject(Logger)
    private logger: Logger;

    private listeners: Map<keyof RepositoryMapping, Record<RepositoryListenerType, Listener[]>> = new Map();

    public async trigger<T>(repository: keyof RepositoryMapping, type: RepositoryListenerType, data: T): Promise<void> {
        const listeners = this.listeners.get(repository)?.[type] ?? [];
        const promises = [];

        for (const method of listeners) {
            promises.push(method(data));
        }

        await Promise.all(promises);
    }

    public load(provider): void {
        const repositoryMethodList = getMethodMetadata<RepositoryListenerMetadata<any>>(
            RepositoryListenerMetadataKey,
            provider
        );

        for (const methodName of Object.keys(repositoryMethodList)) {
            const metadata = repositoryMethodList[methodName];
            const method = provider[methodName].bind(provider);

            const decoratedMethod = async data => {
                try {
                    await method(data);
                } catch (e) {
                    this.logger.error(
                        `Error on repository listener ${metadata.entityType} - ${metadata.type} in method ${methodName} of provider ${provider.constructor.name}`,
                        e
                    );
                }
            };

            if (!this.listeners.has(metadata.entityType)) {
                this.listeners.set(metadata.entityType, {
                    insert: [],
                    update: [],
                    delete: [],
                });
            }

            this.listeners.get(metadata.entityType)[metadata.type].push(decoratedMethod);
        }
    }

    public unload(): void {
        this.listeners.clear();
    }
}
