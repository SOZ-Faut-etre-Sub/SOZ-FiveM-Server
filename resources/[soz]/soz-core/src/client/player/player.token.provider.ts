import { Once, OnceStep } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { RpcServerEvent } from '../../shared/rpc';

@Provider()
export class PlayerTokenProvider {
    private token: string;

    @Once(OnceStep.PlayerLoaded)
    public async loadJwtToken() {
        this.token = await emitRpc<string>(RpcServerEvent.PLAYER_GET_JWT_TOKEN);
    }

    @Exportable('GetJwtToken')
    public getJwtToken(): string {
        return this.token;
    }
}
