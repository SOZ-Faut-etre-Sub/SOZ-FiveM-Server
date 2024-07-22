import { PlayerData } from '@public/shared/player';

import { Inject, Injectable } from '../decorators/injectable';
import { PlayerListenerMetadataKey } from '../decorators/player';
import { getMethodMetadata } from '../decorators/reflect';
import { Logger } from '../logger';

type Listener = (data: PlayerData) => void | Promise<void>;

@Injectable()
export class PlayerLoader {
    @Inject(Logger)
    private logger: Logger;

    private listeners: Listener[] = [];

    public async trigger(data: PlayerData): Promise<void> {
        const promises = [];

        for (const method of this.listeners) {
            promises.push(method(data));
        }

        await Promise.all(promises);
    }

    public load(provider): void {
        const repositoryMethodList = getMethodMetadata(PlayerListenerMetadataKey, provider);

        for (const methodName of Object.keys(repositoryMethodList)) {
            const method = provider[methodName].bind(provider);

            const decoratedMethod = async data => {
                try {
                    await method(data);
                } catch (e) {
                    this.logger.error(
                        `Error on player listener in method ${methodName} of provider ${provider.constructor.name}`,
                        e
                    );
                }
            };

            this.listeners.push(decoratedMethod);
        }
    }

    public unload(): void {
        this.listeners = [];
    }
}
