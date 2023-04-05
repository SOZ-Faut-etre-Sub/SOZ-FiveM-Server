import { Container } from '../container';
import { Inject, Injectable } from '../decorators/injectable';
import { ModuleMetadata, ModuleMetadataKey } from '../decorators/module';
import { Logger } from '../logger';
import { ProviderLoader } from './provider.loader';

@Injectable()
export class ModuleLoader {
    @Inject(ProviderLoader)
    private providerLoader: ProviderLoader;

    @Inject(Logger)
    private logger: Logger;

    private container = Container;

    public load(module: any): void {
        const moduleMetadata = Reflect.getMetadata(ModuleMetadataKey, module) as ModuleMetadata;
        this.logger.debug('[module] load:', moduleMetadata.name);

        for (const provider of moduleMetadata.providers) {
            this.providerLoader.load(this.container.get(provider));
        }
    }

    public unload(): void {
        this.providerLoader.unload();
    }
}
