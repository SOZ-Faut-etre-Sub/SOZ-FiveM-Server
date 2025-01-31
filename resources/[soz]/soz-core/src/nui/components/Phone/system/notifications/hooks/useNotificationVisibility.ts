import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import { useEmergency } from '../../emergency/emergency.atom';
import { usePhoneAvailable, usePhoneVisibility } from '../../phone.atom';
import { lastNotificationAtom } from '../notification.atom';

const DEFAULT_ALERT_HIDE_TIME = 3000;

export const useNotificationVisibility = () => {
    const available = usePhoneAvailable();
    const phoneVisible = usePhoneVisibility();
    const emergency = useEmergency();

    const lastNotification = useAtomValue(lastNotificationAtom);

    const notificationTimer = useRef<NodeJS.Timeout>();
    const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

    useEffect(() => {
        if (phoneVisible || emergency) {
            setNotifVisibility(false);
        }
    }, [phoneVisible, emergency, setNotifVisibility]);

    useEffect(() => {
        if (available && !phoneVisible && lastNotification && !emergency) {
            setNotifVisibility(true);

            if (notificationTimer.current) {
                clearTimeout(notificationTimer.current);
                notificationTimer.current = undefined;
            }

            notificationTimer.current = setTimeout(() => {
                setNotifVisibility(false);
            }, DEFAULT_ALERT_HIDE_TIME);
        }
    }, [available, phoneVisible, lastNotification, emergency, setNotifVisibility]);

    return notifVisibility;
};
