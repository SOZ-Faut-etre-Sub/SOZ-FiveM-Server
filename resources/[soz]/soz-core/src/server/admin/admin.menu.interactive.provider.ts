import { PlayerData } from '@public/shared/player';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { AdminPlayer, FullAdminPlayer, LightAdminPlayer } from '../../shared/admin/admin';
import { RpcServerEvent } from '../../shared/rpc';
import { PermissionService } from '../permission.service';
import { PlayerStateService } from '../player/player.state.service';
import { ServerStateService } from '../server.state.service';
import { VampireGameStateProvider } from '../story/vampire.game.state.provider';

@Provider()
export class AdminMenuInteractiveProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(VampireGameStateProvider)
    private readonly vampireGameStateProvider: VampireGameStateProvider;

    @Rpc(RpcServerEvent.ADMIN_GET_PLAYERS)
    public getPlayers(source: number): AdminPlayer[] {
        if (!this.permissionService.isHelper(source)) {
            return [];
        }

        const players: AdminPlayer[] = [];
        for (const playerData of this.serverStateService.getPlayers()) {
            players.push(this.getPlayer(playerData));
        }
        return players;
    }

    public getPlayer(playerData: PlayerData): AdminPlayer {
        const state = this.playerStateService.getClientState(playerData.source);
        return {
            id: playerData.source,
            citizenId: playerData.citizenid,
            license: playerData.license,
            name: playerData.name,
            rpFullName: `${playerData.charinfo.firstname} ${playerData.charinfo.lastname}`,
            injuries: playerData.metadata.injuries_count,
            partyMember: playerData.partyMember,
            plate: playerData.metadata.plate,
            specialPlate: playerData.metadata.special_plate,
            vampireGameExcluded: this.vampireGameStateProvider.excludedPlayers.has(playerData.citizenid),
            armorPlates: state.nbArmorPlates,
            canCraftMissive: playerData.metadata.criminal_can_craft_missive,
        };
    }

    @Rpc(RpcServerEvent.ADMIN_GET_FULL_PLAYERS)
    public getFullPlayers(source: number): FullAdminPlayer[] {
        if (!this.permissionService.isHelper(source)) {
            return [];
        }

        const players: FullAdminPlayer[] = [];
        for (const playerData of this.serverStateService.getPlayers()) {
            const ped = GetPlayerPed(playerData.source);
            const state = this.playerStateService.getClientState(playerData.source);
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
                partyMember: playerData.partyMember,
                plate: playerData.metadata.plate,
                specialPlate: playerData.metadata.special_plate,
                armorPlates: state.nbArmorPlates,
                canCraftMissive: playerData.metadata.criminal_can_craft_missive,
            });
        }
        return players;
    }

    @Rpc(RpcServerEvent.ADMIN_GET_LIGHT_PLAYERS)
    public getLightPlayers(source: number): LightAdminPlayer[] {
        if (!this.permissionService.isHelper(source)) {
            return [];
        }

        const players: LightAdminPlayer[] = [];
        for (const playerData of this.serverStateService.getPlayers()) {
            const ped = GetPlayerPed(playerData.source);
            const name = `${playerData.charinfo.firstname} ${playerData.charinfo.lastname}`;
            players.push({
                id: playerData.source,
                citizenId: playerData.citizenid,
                name: playerData.name,
                rpFullName: name,
                coords: GetEntityCoords(ped),
                heading: GetEntityHeading(ped),
            });
        }
        return players;
    }
}
