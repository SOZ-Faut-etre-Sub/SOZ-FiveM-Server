import { On, Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Permissions } from '../../core/permissions';
import { PlayerServerState } from '../../shared/player';
import { RpcEvent } from '../../shared/rpc';
import { QBCore } from '../qbcore';
import { PlayerStateService } from './player.state.service';

@Provider()
export class PlayerProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(Permissions)
    private permissions: Permissions;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @On('QBCore:Server:PlayerLoaded', false)
    onPlayerLoaded(player: any) {
        this.permissions.addPlayerRole(player.PlayerData.source, player.PlayerData.role);
    }

    @Once()
    onStart() {
        const connectedSources = this.QBCore.getPlayersSources();

        for (const source of connectedSources) {
            const player = this.QBCore.getPlayer(source);

            this.permissions.addPlayerRole(source, player.PlayerData.role);
        }
    }

    @Rpc(RpcEvent.PLAYER_GET_SERVER_STATE)
    public getServerState(source: number): PlayerServerState {
        return this.playerStateService.get(source);
    }
}
