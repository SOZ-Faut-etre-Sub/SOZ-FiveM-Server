import { Injectable } from '../../core/decorators/injectable';
import { PlayerData } from '../../shared/player';

@Injectable()
export class PlayerService {
    private player: PlayerData | null;

    public setPlayer(player: PlayerData) {
        this.player = player;
    }

    public isLoggedIn(): boolean {
        return LocalPlayer.state.isLoggedIn;
    }

    public getPlayer(): PlayerData {
        return this.player;
    }

    public isOnDuty(): boolean {
        return this.player.job.onduty;
    }
}
