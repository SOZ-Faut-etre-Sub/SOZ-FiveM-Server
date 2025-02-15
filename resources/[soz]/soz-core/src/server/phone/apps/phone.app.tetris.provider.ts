import { Provider } from '@public/core/decorators/provider';
import { LeaderboardTetrisRepository } from '@public/server/repository/leaderboard.tetris.repository';

import { Inject } from '../../../core/decorators/injectable';
import { Rpc } from '../../../core/decorators/rpc';
import { RpcServerEvent } from '../../../shared/rpc';
import { PlayerService } from '../../player/player.service';

@Provider()
export class PhoneAppTetrisProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(LeaderboardTetrisRepository)
    private readonly leaderboardTetrisRepository: LeaderboardTetrisRepository;

    @Rpc(RpcServerEvent.PHONE_APP_TETRIS_ADD_SCORE)
    async addScore(source: number, score: number = 0) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!score || score <= 0) return;

        await this.leaderboardTetrisRepository.addScore(player.citizenid, score);
    }
}
