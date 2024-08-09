import { createModel } from '@rematch/core';
import { Taxes, TaxEvents } from '@typings/app/tax';
import { buildRespObj } from '@utils/misc';

import { ServerPromiseResp } from '../../../../typings/common';
import { MockTax } from '../../apps/tax/utils/constants';
import { fetchNui } from '../../utils/fetchNui';
import { RootModel } from '..';

export const appTax = createModel<RootModel>()({
    state: null as Taxes,
    reducers: {
        set: (state, payload) => {
            return { ...state, ...payload };
        },
        get: state => {
            return state;
        },
    },
    effects: dispatch => ({
        async loadTaxes() {
            fetchNui<ServerPromiseResp<Taxes>>(TaxEvents.FETCH_TAXES, undefined, buildRespObj(MockTax))
                .then(taxes => {
                    dispatch.appTax.set(taxes.data || null);
                })
                .catch(e => console.error('Failed to load taxes'));
        },
    }),
});
