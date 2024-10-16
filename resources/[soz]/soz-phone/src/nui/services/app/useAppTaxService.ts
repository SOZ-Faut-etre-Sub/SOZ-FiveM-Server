import { useEffect } from 'react';

import { store } from '../../store';

export const useAppTaxService = () => {
    useEffect(() => {
        store.dispatch.appTax.loadTaxes();
    }, []);
};
