import { useNotifications } from '@os/notifications/hooks/useNotifications';
import React, { useCallback, useMemo } from 'react';

import { APPS, IApp } from '../config/apps';
import { createLazyAppIcon } from '../utils/createLazyAppIcon';

export const useApps = () => {
    const { icons } = useNotifications();

    const apps: IApp[] = useMemo(() => {
        return APPS.map(app => {
            const NotificationIcon = createLazyAppIcon(app.Icon, { className: 'h-8 w-8 rounded-md' });
            const Icon = createLazyAppIcon(app.Icon, { className: 'h-16 w-16 rounded-[1rem]' });

            return {
                ...app,
                notification: icons.find(i => i.key === app.id),
                NotificationIcon,
                notificationIcon: <NotificationIcon />,
                icon: <Icon />,
            };
        });
    }, [icons]);

    const getApp = useCallback((id: string): IApp => apps.find(a => a.id === id) || null, [apps]);
    return { apps, getApp };
};

export const useApp = (id: string): IApp => {
    const { getApp } = useApps();
    return getApp(id);
};
