import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useNotifications } from '../os/notifications/hooks/useNotifications';
import { DEFAULT_ALERT_HIDE_TIME } from '../os/notifications/notifications.constants';
import { RootState } from '../store';

export const useConfig = () => {
    const state = useSelector((state: RootState) => state.phone);
    return state.config;
};

export const useVisibility = () => {
    const state = useSelector((state: RootState) => state.phone);
    //const { currentAlert } = useNotifications();
    const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

    const notificationTimer = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (state.visible) {
            setNotifVisibility(false);
        }
    }, [state.visible]);

    useEffect(() => {
        if (state.available && !state.visible /*&& currentAlert*/) {
            setNotifVisibility(true);
            if (notificationTimer.current) {
                clearTimeout(notificationTimer.current);
                notificationTimer.current = undefined;
            }
            /*if (currentAlert?.keepWhenPhoneClosed) {
                return;
            }*/
            notificationTimer.current = setTimeout(() => {
                setNotifVisibility(false);
            }, DEFAULT_ALERT_HIDE_TIME);
        }
    }, [/*currentAlert, */ state.visible]);

    return {
        visibility: state.visible,
        notifVisibility: notifVisibility,
    };
};

export const useAvailability = () => {
    const state = useSelector((state: RootState) => state.phone);
    return state.available;
};

export const useTime = () => {
    const state = useSelector((state: RootState) => state.phone);
    return state.time;
};
