import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { RpcServerEvent } from '../../../shared/rpc';
import { LeaderboardTetrisRepository } from '../../repository/leaderboard.tetris.repository';

@Provider()
export class PhoneAppTetrisProvider {
    @Inject(LeaderboardTetrisRepository)
    private leaderboardTetrisRepository: LeaderboardTetrisRepository;

    @OnNuiEvent(NuiEvent.PhoneAppTetrisAddScore)
    async onAddScore(score: number) {
        await emitRpc(RpcServerEvent.PHONE_APP_TETRIS_ADD_SCORE, score);
    }
}
