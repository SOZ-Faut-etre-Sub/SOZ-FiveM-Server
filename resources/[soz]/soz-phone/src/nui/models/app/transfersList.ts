import { createModel } from '@rematch/core';

import { BankTransfer, TransfersListEvents } from '../../../../typings/banktransfer';
import { ServerPromiseResp } from '../../../../typings/common';
import { MockTwitchNewsMessages } from '../../apps/twitch-news/utils/constants';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';
import { RootModel } from '..';

export const appBankTransfersList = createModel<RootModel>()({
    state: [] as BankTransfer[],
    reducers: {
        set: (state, payload) => {
            return [...payload];
        },
        add: (state, payload) => {
            return [payload, ...state];
        },
    },
    effects: dispatch => ({
        async appendTransfer(payload: BankTransfer) {
            dispatch.appBankTransfersList.add(payload);
        },
        // loader
        async loadTransfers() {
            fetchNui<ServerPromiseResp<BankTransfer[]>>(
                TransfersListEvents.FETCH_TRANSFERS,
                undefined,
                buildRespObj(MockTwitchNewsMessages)
            )
                .then(transfers => {
                    dispatch.appBankTransfersList.set(transfers.data.reverse() || []);
                })
                .catch(() => console.error('Failed to load transfers'));
        },
    }),
});
