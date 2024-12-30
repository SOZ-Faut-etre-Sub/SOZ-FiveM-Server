import { createModel } from '@rematch/core';

import { BankStatementItem, BankStatementsEvents } from '../../../../typings/app/bank_statements';
import { ServerPromiseResp } from '../../../../typings/common';
import { BrowserHistoryData } from '../../apps/bank/utils/constants';
import { fetchNui } from '../../common/utils/fetchNui';
import { buildRespObj } from '../../common/utils/misc';
import { RootModel } from '..';

export const appBankStatements = createModel<RootModel>()({
    state: [] as BankStatementItem[],
    reducers: {
        set: (state, payload) => {
            return [...payload];
        },
        add: (state, payload) => {
            return [payload, ...state.slice(0, 49)];
        },
    },
    effects: dispatch => ({
        async setHistory(payload: BankStatementItem[]) {
            dispatch.appBankStatements.set(payload);
        },
        async addHistory(payload: BankStatementItem) {
            dispatch.appBankStatements.add(payload);
        },
        // loader
        async loadBankStatements() {
            fetchNui<ServerPromiseResp<BankStatementItem[]>>(
                BankStatementsEvents.FETCH_LAST_STATEMENTS,
                undefined,
                buildRespObj(BrowserHistoryData)
            )
                .then(messages => {
                    dispatch.appBankStatements.set(messages.data || []);
                })
                .catch(error => {
                    console.error('Failed to load bank history', error);
                });
        },
    }),
});
