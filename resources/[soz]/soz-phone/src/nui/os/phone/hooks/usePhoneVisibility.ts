import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { DEFAULT_ALERT_HIDE_TIME } from '@os/notifications/notifications.constants';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { phoneState } from './state';

export const usePhoneVisibility = () => {
    const isPhoneAvailable = useRecoilValue(phoneState.availability);
    const [visibility, setVisibility] = useRecoilState(phoneState.visibility);
    const { currentAlert } = useNotifications();

    const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

    const notificationTimer = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (visibility) {
            setNotifVisibility(false);
        }
    }, [visibility]);

    useEffect(() => {
        if (isPhoneAvailable && !visibility && currentAlert) {
            setNotifVisibility(true);
            if (notificationTimer.current) {
                clearTimeout(notificationTimer.current);
                notificationTimer.current = undefined;
            }
            if (currentAlert?.keepWhenPhoneClosed) {
                return;
            }
            notificationTimer.current = setTimeout(() => {
                setNotifVisibility(false);
            }, DEFAULT_ALERT_HIDE_TIME);
        }
    }, [currentAlert, visibility, setVisibility]);

    return {
        visibility: visibility,
        notifVisibility: notifVisibility,
    };
};
