import { useEffect } from 'react';

import { store } from '../store';

export const useApiService = () => {
    useEffect(() => {
        store.dispatch.api.loadApi();
    }, []);
};
