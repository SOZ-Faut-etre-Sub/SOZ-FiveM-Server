import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { On, Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { NuiEvent } from '../../../shared/event/nui';
import { LeaderboardInterface } from '../../../shared/phone/apps/game';
import { RpcServerEvent } from '../../../shared/rpc';
import { NuiDispatch } from '../../nui/nui.dispatch';

@Provider()
export class PhoneAppTetrisProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Once(OnceStep.NuiLoaded)
    @OnEvent(ClientEvent.ADMIN_SWITCH_CHARACTER)
    async onNuiLoaded() {
        const leaderboard = await emitRpc<LeaderboardInterface[]>(RpcServerEvent.PHONE_APP_TETRIS_GET_LEADERBOARD);
        this.nuiDispatch.dispatch('phone', 'AppTetrisSetLeaderboard', leaderboard);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTetrisAddScore)
    async onPayInvoice(score: number) {
        await emitRpc(RpcServerEvent.PHONE_APP_TETRIS_ADD_SCORE, score);
    }

    @On(ClientEvent.PHONE_APP_TETRIS_UPDATE_LEADERBOARD)
    async onUpdateLeaderboard(leaderboard: LeaderboardInterface[]) {
        this.nuiDispatch.dispatch('phone', 'AppTetrisSetLeaderboard', leaderboard);
    }
}
