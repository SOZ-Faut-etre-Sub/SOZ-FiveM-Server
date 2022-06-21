import { Inject, Injectable } from '../decorators/injectable';
import { ProviderMetadata, ProviderMetadataKey } from '../decorators/provider';
import { EventLoader } from './EventLoader';
import { TickLoader } from './TickLoader';

@Injectable()
export class ProviderLoader {
    @Inject(TickLoader)
    private tickLoader: TickLoader;
    @Inject(EventLoader)
    private eventLoader: EventLoader;

    public load(provider): void {
        const providerMetadata = Reflect.getMetadata(ProviderMetadataKey, provider) as ProviderMetadata;
        console.debug('[soz-core] [provider] register:', providerMetadata.name);

        this.tickLoader.load(provider);
        this.eventLoader.load(provider);
    }

    public unload(): void {
        this.tickLoader.unload();
        this.eventLoader.unload();
    }
}
