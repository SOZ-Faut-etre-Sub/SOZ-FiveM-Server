import { createModel } from '@rematch/core';
import { InvoiceItem, InvoicesEvents } from '@typings/app/invoices';

import { ServerPromiseResp } from '../../../../typings/common';
import { BrowserInvoicesData } from '../../apps/invoices/utils/constants';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';
import { RootModel } from '..';

export const appInvoices = createModel<RootModel>()({
    state: [] as InvoiceItem[],
    reducers: {
        set: (state, payload) => {
            return [...payload];
        },
        add: (state, payload) => {
            return [payload, ...state];
        },
        remove: (state, payload) => {
            return state.filter(invoice => invoice.id !== payload);
        },
    },
    effects: dispatch => ({
        async setInvoices(payload: InvoiceItem[]) {
            dispatch.appInvoices.set(payload);
        },
        async addInvoice(payload: InvoiceItem) {
            dispatch.appInvoices.add(payload);
        },
        async deleteInvoice(payload: number) {
            dispatch.appInvoices.remove(payload);
        },
        // loader
        async loadInvoices() {
            fetchNui<ServerPromiseResp<InvoiceItem[]>>(
                InvoicesEvents.FETCH_ALL_INVOICES,
                undefined,
                buildRespObj(BrowserInvoicesData)
            )
                .then(messages => {
                    dispatch.appInvoices.set(messages.data || []);
                })
                .catch(() => {
                    console.error('Failed to load invoices');
                });
        },
    }),
});
