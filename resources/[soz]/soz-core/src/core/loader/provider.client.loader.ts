import { Inject, Injectable } from '../decorators/injectable';
import { ProviderLoader } from './provider.loader';
import { StateBagLoader } from './state.loader';

@Injectable(ProviderLoader)
export class ProviderClientLoader extends ProviderLoader {
    @Inject(StateBagLoader)
    private stateBagLoader: StateBagLoader;

    public load(provider): void {
        super.load(provider);

        this.stateBagLoader.load(provider);
    }

    public unload(): void {
        super.unload();
        this.stateBagLoader.unload();
    }
}
