import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { IAlert, useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { CallEvents, CallHistoryItem } from '@typings/call';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ServerPromiseResp } from '../../../typings/common';
import { PhoneEvents } from '../../../typings/phone';
import { SettingsEvents } from '../../../typings/settings';
import { MockHistoryData } from '../apps/dialer/utils/constants';
import { store } from '../store';
import { fetchNui } from '../utils/fetchNui';
import { buildRespObj } from '../utils/misc';

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

    // Reworked
    useEffect(() => {
        fetchNui<ServerPromiseResp<CallHistoryItem[]>>(
            CallEvents.FETCH_CALLS,
            undefined,
            buildRespObj(MockHistoryData)
        ).then(calls => {
            store.dispatch.simCard.setCallHistory(calls.data);
        });
    }, []);

    // useNuiEvent('DIALER', CallEvents.FETCH_CALLS, store.dispatch.appTwitchNews.appendNews);

    useNuiEvent('SIMCARD', PhoneEvents.SET_NUMBER, store.dispatch.simCard.SET_NUMBER);
    useNuiEvent('SOCIETY_SIMCARD', PhoneEvents.SET_SOCIETY_NUMBER, store.dispatch.simCard.SET_SOCIETY_NUMBER);
    useNuiEvent('AVATAR', SettingsEvents.SET_AVATAR, store.dispatch.simCard.SET_AVATAR);
};
