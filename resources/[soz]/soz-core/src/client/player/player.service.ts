import { Inject, Injectable } from '../../core/decorators/injectable';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { Qbcore } from '../qbcore';

@Injectable()
export class PlayerService {
    private player: PlayerData | null = null;

    @Inject(Qbcore)
    private qbcore: Qbcore;

    public setPlayer(player: PlayerData) {
        this.player = player;
        TriggerEvent(ClientEvent.PLAYER_UPDATE.toString(), player);
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

    public setTempClothes(clothes: any) {
        TriggerEvent(ServerEvent.CHARACTER_SET_TEMPORARY_CLOTH, clothes);
    }
}
