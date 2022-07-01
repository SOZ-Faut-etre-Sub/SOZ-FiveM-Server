import { Inject, Injectable } from '../decorators/injectable';
import { CommandLoader } from './command.loader';
import { ProviderLoader } from './provider.loader';
import { RpcLoader } from './rpc.loader';

@Injectable(ProviderLoader)
export class ProviderServerLoader extends ProviderLoader {
    @Inject(RpcLoader)
    private rpcLoader: RpcLoader;

    @Inject(CommandLoader)
    private commandLoader: CommandLoader;

    public load(provider): void {
        super.load(provider);

        this.rpcLoader.load(provider);
        this.commandLoader.load(provider);
    }

    public unload(): void {
        super.unload();

        this.rpcLoader.unload();
        this.commandLoader.unload();
    }
}
