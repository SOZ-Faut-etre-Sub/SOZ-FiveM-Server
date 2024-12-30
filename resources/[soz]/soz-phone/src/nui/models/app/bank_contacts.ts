import { createModel } from '@rematch/core';

import { BankContactItem, BankContactsEvents } from '../../../../typings/app/bank_contacts';
import { ServerPromiseResp } from '../../../../typings/common';
import { BrowserContactsData } from '../../apps/bank/utils/constants';
import { fetchNui } from '../../common/utils/fetchNui';
import { buildRespObj } from '../../common/utils/misc';
import { RootModel } from '..';

export const appBankContacts = createModel<RootModel>()({
    state: [] as BankContactItem[],
    reducers: {
        set: (state, payload) => {
            return [...payload];
        },
        add: (state, payload) => {
            return [payload, ...state];
        },
        remove: (state, payload) => {
            return state.filter(contact => contact.id !== payload);
        },
    },
    effects: dispatch => ({
        async setContacts(payload: BankContactItem[]) {
            dispatch.appBankContacts.set(payload);
        },
        async addContact(payload: BankContactItem) {
            dispatch.appBankContacts.add(payload);
        },
        async removeContact(payload: number) {
            dispatch.appBankContacts.remove(payload);
        },
        // loader
        async loadBankStatements() {
            fetchNui<ServerPromiseResp<BankContactItem[]>>(
                BankContactsEvents.FETCH_ALL_CONTACTS,
                undefined,
                buildRespObj(BrowserContactsData)
            )
                .then(messages => {
                    dispatch.appBankContacts.set(messages.data || []);
                })
                .catch(error => {
                    console.error('Failed to load bank contacts', error);
                });
        },
    }),
});
