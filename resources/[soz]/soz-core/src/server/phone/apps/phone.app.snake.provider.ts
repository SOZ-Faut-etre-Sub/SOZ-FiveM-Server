import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../../core/decorators/injectable';
import { Rpc } from '../../../core/decorators/rpc';
import { RpcServerEvent } from '../../../shared/rpc';
import { PlayerService } from '../../player/player.service';
import { LeaderboardSnakeRepository } from '../../repository/leaderboard.snake.repository';

@Provider()
export class PhoneAppSnakeProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(LeaderboardSnakeRepository)
    private readonly leaderboardSnakeRepository: LeaderboardSnakeRepository;

    @Rpc(RpcServerEvent.PHONE_APP_SNAKE_ADD_SCORE)
    async addScore(source: number, score: number = 0) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!score || score <= 0) return;

        await this.leaderboardSnakeRepository.addScore(player.citizenid, score);
    }
}
