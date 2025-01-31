import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

import { uuidv4 } from '../../../../../../core/utils';
import { useApps } from '../../apps/hooks/useApps';
import { notificationsAtom } from '../notification.atom';
import { INotification } from '../notification.types';

export const useNotification = (id: INotification['id']) => {
    return useAtomValue(notificationsAtom).find(notification => notification.id === id);
};

export const useNotifications = () => {
    const [notifications, setNotifications] = useAtom(notificationsAtom);

    const apps = useApps();

    const addNotification = useCallback(
        (notification: INotification) => {
            const app = apps.find(app => app.id === notification.app);

            setNotifications(prev => [{ ...notification, id: uuidv4(), icon: app.icon }, ...prev]);
        },
        [setNotifications]
    );

    const removeNotification = useCallback(
        (id: INotification['id']) => setNotifications(prev => prev.filter(notification => notification.id !== id)),
        [setNotifications]
    );

    const removeAppNotifications = useCallback(
        (app: string) => setNotifications(prev => prev.filter(notification => notification.app !== app)),
        [setNotifications]
    );

    return {
        notifications,
        addNotification,
        removeNotification,
        removeAppNotifications,
    };
};
