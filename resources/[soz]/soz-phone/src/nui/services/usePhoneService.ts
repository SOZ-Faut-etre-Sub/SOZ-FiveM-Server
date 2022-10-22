import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useApps } from '@os/apps/hooks/useApps';
import { PhoneEvents } from '@typings/phone';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { store } from '../store';

export const usePhoneService = () => {
    const { getApp } = useApps();
    // const { addAlert } = useSnackbar();
    const navigate = useNavigate();

    const handleOpenApp = useCallback(
        (app: string) => {
            // In case user passes us a lowercase string, lets uppercase it as all app IDs are
            // uppercase
            const foundApp = getApp(app.toUpperCase());

            if (!foundApp) return console.error(`App "${app}" is an invalid app id to open`);
            navigate(foundApp.path);
        },
        [getApp, navigate]
    );

    useEffect(() => {
        store.dispatch.phone.loadConfig();
    }, []);

    useNuiEvent('PHONE', 'startRestart', () => {
        setTimeout(() => window.location.reload(), 3000);
    });

    // useNuiEvent('PHONE', PhoneEvents.ADD_SNACKBAR_ALERT, addAlert);
    useNuiEvent('PHONE', PhoneEvents.SET_AVAILABILITY, store.dispatch.phone.setAvailability);
    useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, store.dispatch.phone.setVisibility);
    useNuiEvent('PHONE', PhoneEvents.SET_CONFIG, store.dispatch.phone.setConfig);
    useNuiEvent('PHONE', PhoneEvents.SET_TIME, store.dispatch.phone.setTime);
    useNuiEvent<string>('PHONE', PhoneEvents.OPEN_APP, handleOpenApp);
};
