import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { IAlert, useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { BankEvents } from '@typings/bank';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';

import { bankState } from './state';
import { useCredentials } from './useCredentials';
import { useTransactions } from './useTransactions';

export const useBankService = () => {
    const setCredentials = useSetRecoilState(bankState.bankCredentials);
    const setNotification = useSetRecoilState(bankState.notification);
    const { addAlert } = useSnackbar();
    const [t] = useTranslation();

    const handleAddAlert = ({ message, type }: IAlert) => {
        addAlert({
            message: t(`APPS_${message}`),
            type,
        });
    };

    useNuiEvent('BANK', BankEvents.SEND_CREDENTIALS, setCredentials);
    useNuiEvent('BANK', BankEvents.SEND_ALERT, handleAddAlert);
    useNuiEvent('BANK', BankEvents.SEND_NOTIFICATION, setNotification);
    return { useTransactions, useCredentials };
};
