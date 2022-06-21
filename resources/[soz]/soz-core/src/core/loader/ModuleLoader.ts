import { Container } from '../container';
import { Inject, Injectable } from '../decorators/injectable';
import { ModuleMetadata, ModuleMetadataKey } from '../decorators/module';
import { ProviderLoader } from './ProviderLoader';

@Injectable()
export class ModuleLoader {
    @Inject(ProviderLoader)
    private providerLoader: ProviderLoader;
    private container = Container;

    public load(module: any): void {
        const moduleMetadata = Reflect.getMetadata(ModuleMetadataKey, module) as ModuleMetadata;
        console.debug('[soz-core] [module] load:', moduleMetadata.name);

        for (const provider of moduleMetadata.providers) {
            this.providerLoader.load(this.container.get(provider));
        }
    }

    public unload(): void {
        this.providerLoader.unload();
    }
}
