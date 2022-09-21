import { createModel } from '@rematch/core';
import { BankEvents, IBankCredentials } from '@typings/app/bank';

import { ServerPromiseResp } from '../../../../typings/common';
import { MockBankAccountData } from '../../apps/bank/utils/constants';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';
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
        async loadCredentials() {
            fetchNui<ServerPromiseResp<IBankCredentials>>(
                BankEvents.FIVEM_EVENT_FETCH_BALANCE,
                undefined,
                buildRespObj(MockBankAccountData)
            ).then(credential => {
                dispatch.appBank.set(credential.data || null);
            });
        },
    }),
});
