import { Inject, Injectable } from '../decorators/injectable';
import { ProviderLoader } from './provider.loader';
import { RpcLoader } from './rpc.loader';

@Injectable(ProviderLoader)
export class ProviderServerLoader extends ProviderLoader {
    @Inject(RpcLoader)
    private rpcLoader: RpcLoader;

    public load(provider): void {
        super.load(provider);

        this.rpcLoader.load(provider);
    }

    public unload(): void {
        super.unload();

        this.rpcLoader.unload();
    }
}
