import { createModel } from '@rematch/core';

import { AppCommonState } from '../../../../typings/app/common';
import { RootModel } from '..';

export const appCommon = createModel<RootModel>()({
    state: {
        displayTitle: false,
        title: null,

        getBack: {
            display: false,
            label: 'Retour',
            onClick: () => {},
        },

        actions: [],
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
        async setGetBack(getBack: AppCommonState['getBack']) {
            dispatch.appCommon.set({ getBack });
        },
        async setActions(actions: AppCommonState['actions']) {
            dispatch.appCommon.set({ actions });
        },
    }),
});
