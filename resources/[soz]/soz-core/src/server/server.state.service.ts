import { Injectable } from '@core/decorators/injectable';

import { PlayerData } from '../shared/player';

@Injectable()
export class ServerStateService {
    // Key should be the server id of the player.
    private connectedPlayers: Record<number, PlayerData> = {};

    public getPlayers(): PlayerData[] {
        return Object.values(this.connectedPlayers);
    }

    public addPlayer(player: PlayerData) {
        this.connectedPlayers[player.source] = player;
    }

    public getPlayer(source: number): PlayerData | null {
        return this.connectedPlayers[source] || null;
    }

    public getPlayerByCitizenId(citizenId: string): PlayerData | null {
        return Object.values(this.connectedPlayers).find(player => player.citizenid === citizenId) || null;
    }

    public getPlayerByPhoneNumber(phoneNumber: string): PlayerData | null {
        return Object.values(this.connectedPlayers).find(player => player.charinfo.phone === phoneNumber) || null;
    }

    public getPlayersByJob(job: string): PlayerData[] {
        return Object.values(this.connectedPlayers).filter(player => player.job.id === job);
    }

    public updatePlayer(player: PlayerData) {
        if (!this.connectedPlayers[player.source]) {
            return;
        }

        this.connectedPlayers[player.source] = player;
    }

    public removePlayer(source: number) {
        delete this.connectedPlayers[source];
    }
}
