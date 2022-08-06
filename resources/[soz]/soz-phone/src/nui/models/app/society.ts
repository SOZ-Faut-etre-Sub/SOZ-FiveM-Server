import { createModel } from '@rematch/core';

import { SocietyMessage } from '../../../../typings/society';
import { SocietyContactsState } from '../../apps/society-contacts/utils/constants';
import { RootModel } from '..';

export const appSociety = createModel<RootModel>()({
    state: {
        contacts: SocietyContactsState,
        messages: [] as SocietyMessage[],
    },
    reducers: {
        set: (state, payload) => {
            return { ...state, messages: payload };
        },
        add: (state, payload) => {
            return { ...state, messages: [payload, ...state.messages] };
        },
    },
    effects: dispatch => ({
        async setSocietyMessages(payload: SocietyMessage[]) {
            dispatch.appSociety.set(payload);
        },
        async appendSocietyMessages(payload: SocietyMessage) {
            dispatch.appSociety.add(payload);
        },
    }),
});
