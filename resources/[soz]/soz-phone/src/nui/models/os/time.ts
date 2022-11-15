import { createModel } from '@rematch/core';

import { RootModel } from '../index';

export const time = createModel<RootModel>()({
    state: '00:00',
    reducers: {
        SET_TIME(state, payload: string) {
            return payload;
        },
    },
    effects: dispatch => ({
        async setTime(payload: string) {
            dispatch.time.SET_TIME(payload);
        },
    }),
});
