import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { BankEvents } from '@typings/app/bank';

import { store } from '../../store';

export const useAppBankService = () => {
    useNuiEvent('BANK', BankEvents.SEND_CREDENTIALS, store.dispatch.appBank.setCredentials);
};
