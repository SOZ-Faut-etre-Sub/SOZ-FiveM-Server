import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { AdminPlayer, FullAdminPlayer } from '../../shared/admin/admin';
import { RpcServerEvent } from '../../shared/rpc';
import { PermissionService } from '../permission.service';
import { PlayerService } from '../player/player.service';
import { QBCore } from '../qbcore';
import { ServerStateService } from '../server.state.service';

@Provider()
export class AdminMenuInteractiveProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(QBCore)
    private QBCore: QBCore;

    @Rpc(RpcServerEvent.ADMIN_GET_PLAYERS)
    public getPlayers(source: number): AdminPlayer[] {
        if (!this.permissionService.isHelper(source)) {
            return [];
        }

        const players: AdminPlayer[] = [];
        for (const playerData of this.serverStateService.getPlayers()) {
            players.push({
                id: playerData.source,
                citizenId: playerData.citizenid,
                license: playerData.license,
                name: playerData.name,
                rpFullName: `${playerData.charinfo.firstname} ${playerData.charinfo.lastname}`,
                injuries: playerData.metadata.injuries_count,
            });
        }
        return players;
    }

    @Rpc(RpcServerEvent.ADMIN_GET_FULL_PLAYERS)
    public getFullPlayers(source: number): FullAdminPlayer[] {
        if (!this.permissionService.isHelper(source)) {
            return [];
        }

        const players: FullAdminPlayer[] = [];
        for (const playerData of this.serverStateService.getPlayers()) {
            const ped = GetPlayerPed(playerData.source);
            const name = `${playerData.charinfo.firstname} ${playerData.charinfo.lastname}`;
            players.push({
                id: playerData.source,
                name: playerData.name,
                rpFullName: name,
                license: playerData.license,
                coords: GetEntityCoords(ped),
                heading: GetEntityHeading(ped),
                cid: name,
                citizenId: playerData.citizenid,
                ped: ped,
                injuries: playerData.metadata.injuries_count,
            });
        }
        return players;
    }
}
