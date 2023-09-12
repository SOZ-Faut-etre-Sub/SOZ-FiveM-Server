import { createModel } from '@rematch/core';

import { SnakeEvents } from '../../../../typings/app/snake';
import { LeaderboardInterface, ServerPromiseResp } from '../../../../typings/common';
import { MockTetrisLeaderboard } from '../../apps/game-tetris/utils/constants';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';
import { RootModel } from '..';

export const appSnakeLeaderboard = createModel<RootModel>()({
    state: [] as LeaderboardInterface[],
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
            fetchNui<ServerPromiseResp<LeaderboardInterface[]>>(
                SnakeEvents.FETCH_LEADERBOARD,
                undefined,
                buildRespObj(MockTetrisLeaderboard)
            ).then(leaderboard => {
                dispatch.appSnakeLeaderboard.set(leaderboard.data || []);
            });
        },

        async broadcastLeaderboard(leaderboard: LeaderboardInterface[]) {
            dispatch.appSnakeLeaderboard.set(leaderboard);
        },
    }),
});
