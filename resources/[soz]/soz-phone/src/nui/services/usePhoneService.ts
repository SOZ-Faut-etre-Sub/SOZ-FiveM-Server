import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useApps } from '@os/apps/hooks/useApps';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { PhoneEvents } from '@typings/phone';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { phoneState } from '../os/phone/hooks/state';

export const usePhoneService = () => {
    const { getApp } = useApps();
    // const { addAlert } = useSnackbar();
    const navigate = useNavigate();

    const setAvailability = useSetRecoilState(phoneState.availability);
    const setVisibility = useSetRecoilState(phoneState.visibility);
    const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);
    const setPhoneTime = useSetRecoilState(phoneState.phoneTime);

    const handleOpenApp = useCallback(
        (app: string) => {
            // In case user passes us a lowercase string, lets uppercase it as all app IDs are
            // uppercase
            const foundApp = getApp(app.toUpperCase());

            if (!foundApp) return console.error(`App "${app}" is an invalid app id to open`);
            navigate(foundApp.path);
        },
        [getApp, history]
    );

    // useNuiEvent('PHONE', PhoneEvents.ADD_SNACKBAR_ALERT, addAlert);
    useNuiEvent('PHONE', PhoneEvents.SET_AVAILABILITY, setAvailability);
    useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, setVisibility);
    useNuiEvent('PHONE', PhoneEvents.SET_CONFIG, setResourceConfig);
    useNuiEvent('PHONE', PhoneEvents.SET_TIME, setPhoneTime);
    useNuiEvent<string>('PHONE', PhoneEvents.OPEN_APP, handleOpenApp);
};
