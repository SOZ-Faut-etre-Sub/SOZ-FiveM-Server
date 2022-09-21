import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { BankEvents } from '@typings/app/bank';
import { useEffect } from 'react';

import { store } from '../../store';

export const useAppBankService = () => {
    useEffect(() => {
        store.dispatch.appBank.loadCredentials();
    }, []);

    useNuiEvent('BANK', BankEvents.SEND_CREDENTIALS, store.dispatch.appBank.setCredentials);
};
