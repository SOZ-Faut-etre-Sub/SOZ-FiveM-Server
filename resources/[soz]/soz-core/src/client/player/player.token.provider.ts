import { Once, OnceStep } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { RpcEvent } from '../../shared/rpc';

@Provider()
export class PlayerTokenProvider {
    public token: string | null = null;

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded() {
        this.token = await emitRpc<string | null>(RpcEvent.PLAYER_GET_JWT_TOKEN);
    }
}
