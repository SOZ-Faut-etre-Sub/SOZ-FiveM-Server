import { ApiConfig } from '@public/shared/api';
import { NuiEvent } from '@public/shared/event';
import { createModel } from '@rematch/core';

import { fetchNui } from '../fetch';
import { RootModel } from '.';

export const api = createModel<RootModel>()({
    state: {
        apiEndpoint: 'https://api.soz.zerator.com/graphql',
        publicEndpoint: 'https://soz.zerator.com',
    } as ApiConfig,
    reducers: {
        set: (state, config: Partial<ApiConfig>) => {
            return { ...state, ...config };
        },
    },
    effects: dispatch => ({
        async loadApi() {
            fetchNui<void, ApiConfig>(NuiEvent.GetAPIConfig, undefined)
                .then(config => {
                    dispatch.api.set(config || {});
                })
                .catch(() => console.error('Failed to load api config'));
        },
    }),
});
