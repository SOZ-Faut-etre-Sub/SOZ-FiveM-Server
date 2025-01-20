import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { On, Once, OnceStep, OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { NuiEvent } from '../../../shared/event/nui';
import { LeaderboardInterface } from '../../../shared/phone/apps/game';
import { RpcServerEvent } from '../../../shared/rpc';
import { NuiDispatch } from '../../nui/nui.dispatch';

@Provider()
export class PhoneAppSnakeProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Once(OnceStep.NuiLoaded)
    async onNuiLoaded() {
        const leaderboard = await emitRpc<LeaderboardInterface[]>(RpcServerEvent.PHONE_APP_SNAKE_GET_LEADERBOARD);
        this.nuiDispatch.dispatch('phone', 'AppSnakeSetLeaderboard', leaderboard);
    }

    @OnNuiEvent(NuiEvent.PhoneAppSnakeAddScore)
    async onAddScore(score: number) {
        await emitRpc(RpcServerEvent.PHONE_APP_SNAKE_ADD_SCORE, score);
    }

    @On(ClientEvent.PHONE_APP_SNAKE_UPDATE_LEADERBOARD)
    async onUpdateLeaderboard(leaderboard: LeaderboardInterface[]) {
        this.nuiDispatch.dispatch('phone', 'AppSnakeSetLeaderboard', leaderboard);
    }
}
