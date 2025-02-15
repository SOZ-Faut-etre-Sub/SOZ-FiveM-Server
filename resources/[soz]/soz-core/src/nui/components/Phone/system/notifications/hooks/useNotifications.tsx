import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

import { uuidv4 } from '../../../../../../core/utils';
import { useApps } from '../../apps/hooks/useApps';
import { notificationsAtom } from '../notification.atom';
import { INotification, NewNotification } from '../notification.types';

export const useNotification = (id: INotification['id']) => {
    return useAtomValue(notificationsAtom).find(notification => notification.id === id);
};

export const useNotifications = () => {
    const [notifications, setNotifications] = useAtom(notificationsAtom);

    const apps = useApps();

    const addNotification = useCallback(
        (notification: NewNotification, timeout: number = 3000) => {
            const app = apps.find(app => app.id === notification.app);
            const newNotification = { id: uuidv4(), ...notification, icon: app?.icon };

            setNotifications(prev => [newNotification, ...prev]);

            if (!timeout) return;

            setTimeout(() => removeNotification(newNotification.id), timeout);
        },
        [apps, setNotifications]
    );

    const removeNotification = useCallback(
        (id: INotification['id']) => setNotifications(prev => prev.filter(notification => notification.id !== id)),
        [setNotifications]
    );

    const removeNotificationByGroup = useCallback(
        (app: INotification['app'], group: INotification['group']) =>
            setNotifications(prev =>
                prev.filter(notification => notification.group !== group && notification.app !== app)
            ),
        [setNotifications]
    );

    const removeAppNotifications = useCallback(
        (app: string) => setNotifications(prev => prev.filter(notification => notification.app !== app)),
        [setNotifications]
    );

    const cleanNotifications = useCallback(() => setNotifications([]), [setNotifications]);

    return {
        notifications,
        addNotification,
        removeNotification,
        removeAppNotifications,
        removeNotificationByGroup,

        cleanNotifications,
    };
};
