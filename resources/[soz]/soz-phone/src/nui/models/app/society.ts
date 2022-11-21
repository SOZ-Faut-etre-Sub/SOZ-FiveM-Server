import { createModel } from '@rematch/core';

import { ServerPromiseResp } from '../../../../typings/common';
import { SocietyEvents, SocietyMessage } from '../../../../typings/society';
import { SocietyContactsState } from '../../apps/society-contacts/utils/constants';
import { MockSocietyMessages } from '../../apps/society-messages/utils/constants';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';
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
        update: (state, payload) => {
            console.log('update', payload);
            return {
                ...state,
                messages: state.messages.map(message => (message.id === payload.id ? payload : message)),
            };
        },
    },
    effects: dispatch => ({
        async setSocietyMessages(payload: SocietyMessage[]) {
            dispatch.appSociety.set(payload);
        },
        async appendSocietyMessages(payload: SocietyMessage) {
            dispatch.appSociety.add(payload);
        },
        async updateSocietyMessages(payload: SocietyMessage) {
            dispatch.appSociety.update(payload);
        },
        // loader
        async loadSocietyMessages() {
            fetchNui<ServerPromiseResp<SocietyMessage[]>>(
                SocietyEvents.FETCH_SOCIETY_MESSAGES,
                undefined,
                buildRespObj(MockSocietyMessages)
            ).then(messages => {
                dispatch.appSociety.set(messages.data || []);
            });
        },
    }),
});
