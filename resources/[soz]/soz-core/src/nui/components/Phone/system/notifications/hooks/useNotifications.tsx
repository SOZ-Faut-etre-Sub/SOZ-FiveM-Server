import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { notificationsAtom } from '../notification.atom';
import { INotification } from '../notification.types';

export const useNotifications = () => {
    const [notifications, setNotifications] = useAtom(notificationsAtom);

    const addNotification = useCallback(
        (notification: INotification) => setNotifications(prev => [...prev, notification]),
        [setNotifications]
    );

    const removeNotification = useCallback(
        (id: INotification['id']) => setNotifications(prev => prev.filter(notification => notification.id !== id)),
        [setNotifications]
    );

    return {
        notifications,
        addNotification,
        removeNotification,
    };
};
