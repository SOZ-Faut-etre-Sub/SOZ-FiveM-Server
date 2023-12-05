import { createModel } from '@rematch/core';

import { TetrisEvents, TetrisLeaderboard } from '../../../../typings/app/tetris';
import { ServerPromiseResp } from '../../../../typings/common';
import { MockTetrisLeaderboard } from '../../apps/game-tetris/utils/constants';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';
import { RootModel } from '..';

export const appTetrisLeaderboard = createModel<RootModel>()({
    state: [] as TetrisLeaderboard[],
    reducers: {
        set: (state, payload) => {
            return [...payload];
        },
        add: (state, payload) => {
            return [payload, ...state];
        },
    },
    effects: dispatch => ({
        // loader
        async loadLeaderboard() {
            fetchNui<ServerPromiseResp<TetrisLeaderboard[]>>(
                TetrisEvents.FETCH_LEADERBOARD,
                undefined,
                buildRespObj(MockTetrisLeaderboard)
            ).then(leaderboard => {
                dispatch.appTetrisLeaderboard.set(leaderboard.data || []);
            });
        },

        async broadcastLeaderboard(leaderboard: TetrisLeaderboard[]) {
            dispatch.appTetrisLeaderboard.set(leaderboard);
        },
    }),
});
