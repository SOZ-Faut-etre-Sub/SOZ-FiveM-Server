import { Inject, Injectable } from '../decorators/injectable';
import { ProviderLoader } from './provider.loader';
import { RepositoryLoader } from './repository.loader';

@Injectable(ProviderLoader)
export class ProviderClientLoader extends ProviderLoader {
    @Inject(RepositoryLoader)
    private repositoryLoader: RepositoryLoader;

    public load(provider): void {
        super.load(provider);

        this.repositoryLoader.load(provider);
    }

    public unload(): void {
        super.unload();
    }
}
