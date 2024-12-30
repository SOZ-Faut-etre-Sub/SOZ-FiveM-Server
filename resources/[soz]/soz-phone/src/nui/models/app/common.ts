import { createModel } from '@rematch/core';

import { AppCommonState } from '../../../../typings/app/common';
import { RootModel } from '..';

export const appCommon = createModel<RootModel>()({
    state: {
        displayTitle: false,
        title: null,
    } as AppCommonState,
    reducers: {
        set: (state, payload) => {
            return { ...state, ...payload };
        },
    },
    effects: dispatch => ({
        async displayTitle(displayTitle: boolean) {
            dispatch.appCommon.set({ displayTitle });
        },
        async setTitle(title: string | null) {
            dispatch.appCommon.set({ title });
        },
    }),
});
