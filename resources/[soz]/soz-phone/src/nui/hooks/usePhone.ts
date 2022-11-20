import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { DEFAULT_ALERT_HIDE_TIME } from '../os/notifications/notifications.constants';
import { RootState } from '../store';

export const useConfig = () => {
    const state = useSelector((state: RootState) => state.phone);

    return state.config;
};

export const useVisibility = () => {
    const visible = useSelector((state: RootState) => state.visibility);
    const available = useSelector((state: RootState) => state.phone.available);
    //const { currentAlert } = useNotifications();
    const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

    const notificationTimer = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (visible) {
            setNotifVisibility(false);
        }
    }, [visible]);

    useEffect(() => {
        if (available && !visible /*&& currentAlert*/) {
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
    }, [/*currentAlert, */ visible]);

    return {
        visibility: visible,
        notifVisibility: notifVisibility,
    };
};

export const useAvailability = () => {
    const state = useSelector((state: RootState) => state.phone);
    return state.available;
};

export const useTime = () => {
    return useSelector((state: RootState) => state.time);
};

export const useCallModal = () => {
    const state = useSelector((state: RootState) => state.phone);
    return state.callModal;
};
