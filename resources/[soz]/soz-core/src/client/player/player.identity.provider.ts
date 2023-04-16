import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { NuiEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from './player.service';

@Provider()
export class PlayerIdentityProvider {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private mugshotCache: Map<string, string> = new Map();

    @OnNuiEvent<{ player: PlayerData }, string>(NuiEvent.PlayerGetMugshot)
    public async getMugshot({ player }: { player: PlayerData }): Promise<string> {
        const currentPlayer = this.playerService.getPlayer();
        const ped = GetPlayerPed(currentPlayer.source === player.source ? -1 : player.source);

        if (!ped) {
            return null;
        }

        if (this.mugshotCache.has(player.citizenid)) {
            return this.mugshotCache.get(player.citizenid);
        }

        this.mugshotCache.set(player.citizenid, null);

        const mugshot = RegisterPedheadshot_3(ped);

        while (!IsPedheadshotReady(mugshot) || !IsPedheadshotValid(mugshot)) {
            await wait(100);
        }

        const mugshotTxd = GetPedheadshotTxdString(mugshot);

        this.mugshotCache.set(player.citizenid, mugshotTxd);

        return mugshotTxd;
    }
}
