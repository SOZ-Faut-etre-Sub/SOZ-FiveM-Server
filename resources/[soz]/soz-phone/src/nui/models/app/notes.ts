import { createModel } from '@rematch/core';
import { INotes } from '@typings/app/notes';

import { RootModel } from '..';

export const appNotes = createModel<RootModel>()({
    state: [] as INotes[] | null,
    reducers: {
        set: (state, payload) => {
            return { ...state, ...payload };
        },
    },
    effects: dispatch => ({
        async setCredentials(payload: INotes[]) {
            dispatch.appNotes.set(payload);
        },
    }),
});
