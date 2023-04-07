import { Inject, Injectable } from '../decorators/injectable';
import { ProviderLoader } from './provider.loader';
import { RouteLoader } from './route.loader';

@Injectable(ProviderLoader)
export class ProviderServerLoader extends ProviderLoader {
    @Inject(RouteLoader)
    private routeLoader: RouteLoader;

    public load(provider): void {
        super.load(provider);
        this.routeLoader.load(provider);
    }

    public unload(): void {
        super.unload();
        this.routeLoader.unload();
    }
}
