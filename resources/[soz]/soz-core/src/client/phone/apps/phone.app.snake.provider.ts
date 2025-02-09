import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { RpcServerEvent } from '../../../shared/rpc';
import { LeaderboardSnakeRepository } from '../../repository/leaderboard.snake.repository';

@Provider()
export class PhoneAppSnakeProvider {
    @Inject(LeaderboardSnakeRepository)
    private leaderboardSnakeRepository: LeaderboardSnakeRepository;

    @OnNuiEvent(NuiEvent.PhoneAppSnakeAddScore)
    async onAddScore(score: number) {
        await emitRpc(RpcServerEvent.PHONE_APP_SNAKE_ADD_SCORE, score);
    }
}
