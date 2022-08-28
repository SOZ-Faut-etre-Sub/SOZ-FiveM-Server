import { Inject } from '../decorators/injectable';
import { ProviderMetadata, ProviderMetadataKey } from '../decorators/provider';
import { Logger } from '../logger';
import { CommandLoader } from './command.loader';
import { EventLoader } from './event.loader';
import { ExportLoader } from './exports.loader';
import { OnceLoader } from './once.loader';
import { TickLoader } from './tick.loader';

export abstract class ProviderLoader {
    @Inject(TickLoader)
    private tickLoader: TickLoader;

    @Inject(EventLoader)
    private eventLoader: EventLoader;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(ExportLoader)
    private exportLoader: ExportLoader;

    @Inject(Logger)
    private logger: Logger;

    @Inject(CommandLoader)
    private commandLoader: CommandLoader;

    public load(provider): void {
        const providerMetadata = Reflect.getMetadata(ProviderMetadataKey, provider) as ProviderMetadata;
        this.logger.debug('[soz-core] [provider] register:', providerMetadata.name);

        this.tickLoader.load(provider);
        this.eventLoader.load(provider);
        this.onceLoader.load(provider);
        this.exportLoader.load(provider);
        this.commandLoader.load(provider);
    }

    public unload(): void {
        this.tickLoader.unload();
        this.eventLoader.unload();
        this.onceLoader.unload();
        this.exportLoader.unload();
        this.commandLoader.unload();
    }
}
