import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { IAlert, useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { CallEvents } from '@typings/call';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { PhoneEvents } from '../../../typings/phone';
import { SettingsEvents } from '../../../typings/settings';
import { store } from '../store';

export const useSimCardService = () => {
    const { addAlert } = useSnackbar();
    const [t] = useTranslation();

    const handleAddAlert = ({ message, type }: IAlert) => {
        addAlert({
            message: t(`APPS_${message}`),
            type,
        });
    };

    useNuiEvent('DIALER', CallEvents.SEND_ALERT, handleAddAlert);

    useEffect(() => {
        store.dispatch.simCard.loadCallHistory();
    }, []);

    useNuiEvent('DIALER', CallEvents.ADD_CALL, store.dispatch.simCard.loadCallHistory);
    useNuiEvent('DIALER', CallEvents.UPDATE_CALL, store.dispatch.simCard.loadCallHistory);

    useNuiEvent('SIMCARD', PhoneEvents.SET_NUMBER, number => {
        if (store.getState().simCard.number !== number) {
            store.dispatch.simCard.SET_NUMBER;
        }
    });
    useNuiEvent('SOCIETY_SIMCARD', PhoneEvents.SET_SOCIETY_NUMBER, number => {
        if (store.getState().simCard.number !== number) {
            store.dispatch.simCard.SET_SOCIETY_NUMBER;
        }
    });
    useNuiEvent('AVATAR', SettingsEvents.SET_AVATAR, store.dispatch.avatar.setAvatar);
};
