import { createModel } from '@rematch/core';

import { ServerPromiseResp } from '../../../../typings/common';
import { SnakeEvents } from '../../../../typings/snake';
import { fetchNui } from '../../utils/fetchNui';
import { RootModel } from '../index';

export const appSnake = createModel<RootModel>()({
    state: 0 as number,
    reducers: {
        set: (state, payload) => {
            return payload;
        },
    },
    effects: dispatch => ({
        async getSnakeHighscore() {
            fetchNui<ServerPromiseResp<number>>(SnakeEvents.GET_HIGHSCORE, undefined)
                .then(response => {
                    dispatch.appSnake.set(response.data || 0);
                })
                .catch(e => console.error('Failed to get snake highscore', e));
        },
    }),
});
