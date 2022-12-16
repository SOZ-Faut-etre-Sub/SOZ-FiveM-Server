import axios from 'axios';

import { On, Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Permissions } from '../../core/permissions';
import { PlayerServerState } from '../../shared/player';
import { RpcEvent } from '../../shared/rpc';
import { QBCore } from '../qbcore';
import { ServerStateService } from '../server.state.service';
import { PlayerStateService } from './player.state.service';

@Provider()
export class PlayerProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(Permissions)
    private permissions: Permissions;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    private jwtTokenCache: Record<string, string> = {};

    @On('QBCore:Server:PlayerLoaded', false)
    onPlayerLoaded(player: any) {
        this.permissions.addPlayerRole(player.PlayerData.source, player.PlayerData.role);
        this.serverStateService.addPlayer(player.PlayerData);
    }

    @On('QBCore:Server:PlayerUnload', false)
    onPlayerUnload(source: number) {
        this.serverStateService.removePlayer(source);
    }

    @Once()
    onStart() {
        const connectedSources = this.QBCore.getPlayersSources();

        for (const source of connectedSources) {
            const player = this.QBCore.getPlayer(source);

            this.serverStateService.addPlayer(player.PlayerData);
            this.permissions.addPlayerRole(source, player.PlayerData.role);
        }
    }

    @Rpc(RpcEvent.PLAYER_GET_SERVER_STATE)
    public getServerState(source: number): PlayerServerState {
        return this.playerStateService.get(source);
    }

    @Rpc(RpcEvent.PLAYER_GET_JWT_TOKEN)
    public async getJwtToken(source: number): Promise<string | null> {
        const steam = this.QBCore.getSteamIdentifier(source);

        if (this.jwtTokenCache[steam]) {
            return this.jwtTokenCache[steam];
        }

        const url = GetConvar('soz_api_endpoint', 'https://api.soz.zerator.com') + '/accounts/create-token/' + steam;
        const response = await axios.get(url, {
            auth: {
                username: GetConvar('soz_api_username', 'admin'),
                password: GetConvar('soz_api_password', 'admin'),
            },
        });

        if (response.status === 200) {
            this.jwtTokenCache[steam] = response.data.token;
            return response.data.toString();
        }

        return null;
    }
}
