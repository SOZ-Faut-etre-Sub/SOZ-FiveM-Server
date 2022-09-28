import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcEvent } from '../../shared/rpc';

@Provider()
export class VoipProvider {
    @Rpc(RpcEvent.VOIP_IS_MUTED)
    public isMuted(playerId: number): boolean {
        return MumbleIsPlayerMuted(playerId);
    }
}
