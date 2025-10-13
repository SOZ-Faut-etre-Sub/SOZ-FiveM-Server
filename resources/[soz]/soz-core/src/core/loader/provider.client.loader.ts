import { Inject, Injectable } from '../decorators/injectable';
import { PlayerInventoryClothesLoader } from './player.inventory.clothes.loader';
import { PlayerInventoryLoader } from './player.inventory.loader';
import { ProviderLoader } from './provider.loader';
import { RepositoryLoader } from './repository.loader';

@Injectable(ProviderLoader)
export class ProviderClientLoader extends ProviderLoader {
    @Inject(RepositoryLoader)
    private repositoryLoader: RepositoryLoader;

    @Inject(PlayerInventoryLoader)
    private playerInventoryLoader: PlayerInventoryLoader;

    @Inject(PlayerInventoryClothesLoader)
    private playerInventoryClothesLoader: PlayerInventoryClothesLoader;

    public load(provider): void {
        super.load(provider);

        this.repositoryLoader.load(provider);
        this.playerInventoryLoader.load(provider);
        this.playerInventoryClothesLoader.load(provider);
    }

    public unload(): void {
        super.unload();
    }
}
