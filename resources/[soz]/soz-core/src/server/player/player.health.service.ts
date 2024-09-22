import { Inject, Injectable } from '../../core/decorators/injectable';
import { PlayerService } from './player.service';
import { PlayerStateService } from './player.state.service';

const STRESS_MIN = 0;
const STRESS_MAX = 100;

@Injectable()
export class PlayerHealthService {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    public async increaseStress(source: number, stress: number): Promise<void> {
        const playerState = this.playerStateService.getServerState(source);
        playerState.lastStressLevelUpdate = new Date();
        this.playerService.incrementMetadata(source, 'stress_level', stress, STRESS_MIN, STRESS_MAX);
    }
}
