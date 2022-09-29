import { Inject, Injectable } from '../../core/decorators/injectable';
import { PlayerServerState } from '../../shared/player';
import { PlayerService } from './player.service';

@Injectable()
export class PlayerStateService {
    @Inject(PlayerService)
    private playerService: PlayerService;

    private stateByCitizenId: Record<string, PlayerServerState> = {};

    public getByCitizenId(citizenId: string) {
        if (!this.stateByCitizenId[citizenId]) {
            this.stateByCitizenId[citizenId] = this.getDefaultPlayerSate();
        }

        return this.stateByCitizenId[citizenId];
    }

    public get(source: number): PlayerServerState {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return this.getDefaultPlayerSate();
        }

        return this.getByCitizenId(player.citizenid);
    }

    private getDefaultPlayerSate(): PlayerServerState {
        return {
            exercise: { chinUp: false, pushUp: false, sitUp: false, freeWeight: false, completed: 0 },
            exercisePushUp: false,
            lostStamina: 0,
            lostStrength: 0,
            runTime: 0,
            yoga: false,
        };
    }
}
