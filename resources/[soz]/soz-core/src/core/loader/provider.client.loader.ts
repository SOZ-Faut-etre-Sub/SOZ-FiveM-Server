import { Injectable } from '../decorators/injectable';
import { ProviderLoader } from './provider.loader';

@Injectable(ProviderLoader)
export class ProviderClientLoader extends ProviderLoader {
    public load(provider): void {
        super.load(provider);
    }

    public unload(): void {
        super.unload();
    }
}
