import { Exportable } from '../../core/decorators/exports';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { RpcServerEvent } from '../../shared/rpc';

@Provider()
export class VoipProvider {
    @Exportable('GetPlayersMegaphoneInUse')
    public async getPlayersMegaphoneInUse(): Promise<number[]> {
        return await emitRpc<number[]>(RpcServerEvent.VOIP_GET_MEGAPHONE_PLAYERS);
    }
}
