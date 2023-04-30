import { createModel } from '@rematch/core';

import { ApiConfig, ApiEvents } from '../../../typings/api';
import { fetchNui } from '../utils/fetchNui';
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
            fetchNui<ApiConfig>(ApiEvents.LOAD_API, undefined, {
                apiEndpoint: 'https://api.soz.zerator.com/graphql',
                publicEndpoint: 'https://soz.zerator.com',
            })
                .then(config => {
                    dispatch.api.set(config || {});
                })
                .catch(() => console.error('Failed to load api config'));
        },
    }),
});
