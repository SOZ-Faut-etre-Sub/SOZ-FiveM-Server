import { createModel } from '@rematch/core';
import { IBankCredentials } from '@typings/app/bank';

import { RootModel } from '..';

export const appBank = createModel<RootModel>()({
    state: null as IBankCredentials | null,
    reducers: {
        set: (state, payload) => {
            return { ...state, ...payload };
        },
    },
    effects: dispatch => ({
        async setCredentials(payload: IBankCredentials) {
            dispatch.appBank.set(payload);
        },
    }),
});
