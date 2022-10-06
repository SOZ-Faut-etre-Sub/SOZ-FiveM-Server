import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { useRingtoneSound } from '@os/sound/hooks/useRingtoneSound';
import { ActiveCall } from '@typings/call';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CallNotification } from '../components/CallNotification';

const NOTIFICATION_ID = 'call:current';

export const useCallNotifications = () => {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const { addNotificationAlert, removeId, addNotification } = useNotifications();

    const { play, stop } = useRingtoneSound();

    const { icon: Icon } = useApp('dialer');

    const callNotificationBase = {
        app: 'CALL',
        id: NOTIFICATION_ID,
        cantClose: true,
        Icon,
        onClick: () => {
            navigate('/call');
            removeId(NOTIFICATION_ID);
        },
        notificationIcon: () => <Icon className="h-5 w-5 rounded-md" />,
    };

    const clearNotification = (): void => {
        removeId(NOTIFICATION_ID);
        stop();
    };

    const setNotification = (call: ActiveCall) => {
        stop();
        if (!call) {
            removeId(NOTIFICATION_ID);
            return;
        }

        if (call?.is_accepted) {
            removeId(NOTIFICATION_ID);
            addNotification({
                ...callNotificationBase,
                content: (
                    <CallNotification>
                        {t('DIALER.MESSAGES.CURRENT_CALL_WITH', {
                            transmitter: call.transmitter,
                        })}
                    </CallNotification>
                ),
                title: t('DIALER.MESSAGES.CURRENT_CALL_TITLE'),
            });
        }
        if (!call?.isTransmitter && !call?.is_accepted) {
            play();
            removeId(NOTIFICATION_ID);
            addNotificationAlert(
                {
                    ...callNotificationBase,
                    title: t('DIALER.MESSAGES.INCOMING_CALL_TITLE', {
                        transmitter: call.transmitter,
                    }),
                    keepWhenPhoneClosed: false,
                    content: (
                        <CallNotification>
                            {t('DIALER.MESSAGES.TRANSMITTER_IS_CALLING', {
                                transmitter: call.transmitter,
                            })}
                        </CallNotification>
                    ),
                },
                n => addNotification(n)
            );
        }
    };

    return { setNotification, clearNotification };
};
