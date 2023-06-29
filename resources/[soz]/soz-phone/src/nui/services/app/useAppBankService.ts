import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { BankEvents } from '@typings/app/bank';
import { TransfersListEvents } from '@typings/banktransfer';
import { useEffect } from 'react';

import { store } from '../../store';

export const useAppBankService = () => {
    useEffect(() => {
        store.dispatch.appBank.loadCredentials();
        store.dispatch.appBankTransfersList.loadTransfers();
    }, []);

    useNuiEvent('BANK', BankEvents.SEND_CREDENTIALS, store.dispatch.appBank.setCredentials);
    useNuiEvent('BANK', TransfersListEvents.TRANSFER_BROADCAST, store.dispatch.appBankTransfersList.appendTransfer);
};
