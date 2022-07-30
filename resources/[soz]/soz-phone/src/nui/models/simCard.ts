import { createModel } from '@rematch/core';

import { CallHistoryItem } from '../../../typings/call';
import { RootModel } from '.';

export const simCard = createModel<RootModel>()({
    state: {
        callHistory: [] as CallHistoryItem[],
    },
    reducers: {
        setCallHistory(state, payload: CallHistoryItem[]) {
            return { ...state, callHistory: payload };
        },
    },
    effects: dispatch => ({
        async setCallHistory(payload: CallHistoryItem[]) {
            dispatch.simCard.setCallHistory(payload);
        },
    }),
});
