import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { AdminPlayer } from '../../shared/admin/admin';
import { RpcEvent } from '../../shared/rpc';
import { PermissionService } from '../permission.service';
import { QBCore } from '../qbcore';

@Provider()
export class AdminMenuInteractiveProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(QBCore)
    private QBCore: QBCore;

    @Rpc(RpcEvent.ADMIN_GET_PLAYERS)
    public getPlayers(source: number): AdminPlayer[] {
        if (!this.permissionService.isHelper(source)) {
            return [];
        }

        const players: AdminPlayer[] = [];
        for (const playerSource of this.QBCore.getPlayersSources()) {
            const ped = GetPlayerPed(playerSource);
            const player = this.QBCore.getPlayer(playerSource);
            const name = `${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}`;
            players.push({
                id: playerSource,
                name: name,
                coords: GetEntityCoords(ped),
                heading: GetEntityHeading(ped),
                cid: name,
                citizenId: player.PlayerData.citizenid,
                ped: ped,
                source: player.PlayerData.source,
            });
        }
        return players;
    }
}
