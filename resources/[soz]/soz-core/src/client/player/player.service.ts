import { getDistance, Vector3 } from '@public/shared/polyzone/vector';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { Outfit } from '../../shared/cloth';
import { ClientEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { NuiDispatch } from '../nui/nui.dispatch';
import { Qbcore } from '../qbcore';

@Injectable()
export class PlayerService {
    private player: PlayerData | null = null;

    @Inject(Qbcore)
    private qbcore: Qbcore;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    public setPlayer(player: PlayerData) {
        this.player = player;
        TriggerEvent(ClientEvent.PLAYER_UPDATE.toString(), player);
        this.nuiDispatch.dispatch('player', 'Update', player);
    }

    public isLoggedIn(): boolean {
        return LocalPlayer.state.isLoggedIn;
    }

    public getPlayer(): PlayerData | null {
        return this.player;
    }

    public isOnDuty(): boolean {
        return this.player.job.onduty;
    }

    public getClosestPlayer(): [number, number] {
        return this.qbcore.getClosestPlayer();
    }

    public setTempClothes(clothes: Outfit | null) {
        TriggerEvent(ClientEvent.CHARACTER_SET_TEMPORARY_CLOTH, clothes || {});
    }

    public reApplyHeadConfig() {
        exports['soz-character'].ReApplyHeadConfig();
    }

    public resetClothConfig() {
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
    }

    public getPlayersAround(position: Vector3, distance: number): number[] {
        const players = GetActivePlayers() as number[];
        const closePlayers = [];

        for (const player of players) {
            const ped = GetPlayerPed(player);
            const pedCoords = GetEntityCoords(ped) as Vector3;
            const playerDistance = getDistance(position, pedCoords);

            if (playerDistance <= distance) {
                closePlayers.push(GetPlayerServerId(player));
            }
        }

        return closePlayers;
    }
}
