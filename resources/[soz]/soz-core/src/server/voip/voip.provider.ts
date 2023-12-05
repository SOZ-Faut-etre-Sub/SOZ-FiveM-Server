import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';

@Provider()
export class VoipProvider {
    private readonly httpEndpoint: string;

    private playersWithMegaphone = new Set<number>();

    constructor() {
        this.httpEndpoint = GetConvar('soz_voip_mumble_http_endpoint', '');
    }

    @Rpc(RpcServerEvent.VOIP_IS_MUTED)
    public isMuted(playerId: number): boolean {
        if (this.httpEndpoint !== '') {
            return exports['soz-voip'].ZumbleIsPlayerMuted(playerId);
        }
        return MumbleIsPlayerMuted(playerId);
    }

    @Rpc(RpcServerEvent.VOIP_GET_MEGAPHONE_PLAYERS)
    public getMegaphonePlayers(): number[] {
        return [...this.playersWithMegaphone];
    }

    @OnEvent(ServerEvent.VOIP_SET_MEGAPHONE)
    public setMegaphone(source: number, value: boolean) {
        if (value) {
            this.playersWithMegaphone.add(source);
        } else {
            this.playersWithMegaphone.delete(source);
        }

        TriggerClientEvent(ClientEvent.VOIP_SET_MEGAPHONE, -1, source, value);
    }
}
