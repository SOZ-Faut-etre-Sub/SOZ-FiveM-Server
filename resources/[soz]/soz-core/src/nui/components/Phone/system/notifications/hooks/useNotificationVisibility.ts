import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import { useEmergency } from '../../emergency/emergency.atom';
import { usePhoneAvailable } from '../../phone.atom';
import { lastNotificationAtom } from '../notification.atom';

const DEFAULT_ALERT_HIDE_TIME = 3000;

export const useNotificationVisibility = () => {
    const emergency = useEmergency();
    const available = usePhoneAvailable();

    const lastNotification = useAtomValue(lastNotificationAtom);

    const notificationTimer = useRef<NodeJS.Timeout>();
    const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

    useEffect(() => {
        if (!available || emergency) return;
        if (!lastNotification) return;

        setNotifVisibility(true);

        if (notificationTimer.current) {
            clearTimeout(notificationTimer.current);
        }

        notificationTimer.current = setTimeout(() => {
            setNotifVisibility(false);
        }, DEFAULT_ALERT_HIDE_TIME);
    }, [available, emergency, lastNotification, setNotifVisibility]);

    return notifVisibility;
};
