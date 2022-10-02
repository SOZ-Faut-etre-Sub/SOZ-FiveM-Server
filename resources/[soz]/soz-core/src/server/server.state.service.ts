import { Injectable } from '../core/decorators/injectable';
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

    public removePlayer(source: number) {
        delete this.connectedPlayers[source];
    }
}
