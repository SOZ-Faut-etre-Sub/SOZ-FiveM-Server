import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import { useEmergency } from '../../emergency/emergency.atom';
import { lastNotificationAtom } from '../notification.atom';

const DEFAULT_ALERT_HIDE_TIME = 3000;

export const useNotificationVisibility = () => {
    const emergency = useEmergency();

    const lastNotification = useAtomValue(lastNotificationAtom);

    const notificationTimer = useRef<NodeJS.Timeout>();
    const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

    useEffect(() => {
        if (lastNotification && !emergency) {
            setNotifVisibility(true);

            if (notificationTimer.current) {
                clearTimeout(notificationTimer.current);
            }

            notificationTimer.current = setTimeout(() => {
                setNotifVisibility(false);
            }, DEFAULT_ALERT_HIDE_TIME);
        }
    }, [lastNotification, emergency, setNotifVisibility]);

    return notifVisibility;
};
