import { createModel } from '@rematch/core';

import { RootModel } from '../index';

export const visibility = createModel<RootModel>()({
    state: false,
    reducers: {
        SET_VISIBILITY(state, payload: boolean) {
            return payload;
        },
    },
    effects: dispatch => ({
        async setVisibility(payload: boolean) {
            dispatch.visibility.SET_VISIBILITY(payload);
        },
    }),
});
