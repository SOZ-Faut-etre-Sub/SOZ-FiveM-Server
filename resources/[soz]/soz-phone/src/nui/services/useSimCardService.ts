import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { IAlert, useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { CallEvents, CallHistoryItem } from '@typings/call';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ServerPromiseResp } from '../../../typings/common';
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
};
