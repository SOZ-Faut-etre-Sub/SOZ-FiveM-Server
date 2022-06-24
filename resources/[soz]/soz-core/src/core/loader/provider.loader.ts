import { Inject, Injectable } from '../decorators/injectable';
import { ProviderMetadata, ProviderMetadataKey } from '../decorators/provider';
import { Logger } from '../logger';
import { EventLoader } from './event.loader';
import { OnceLoader } from './once.loader';
import { TickLoader } from './tick.loader';

@Injectable()
export class ProviderLoader {
    @Inject(TickLoader)
    private tickLoader: TickLoader;

    @Inject(EventLoader)
    private eventLoader: EventLoader;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(Logger)
    private logger: Logger;

    public load(provider): void {
        const providerMetadata = Reflect.getMetadata(ProviderMetadataKey, provider) as ProviderMetadata;
        this.logger.debug('[soz-core] [provider] register:', providerMetadata.name);

        this.tickLoader.load(provider);
        this.eventLoader.load(provider);
        this.onceLoader.load(provider);
    }

    public unload(): void {
        this.tickLoader.unload();
        this.eventLoader.unload();
    }
}
