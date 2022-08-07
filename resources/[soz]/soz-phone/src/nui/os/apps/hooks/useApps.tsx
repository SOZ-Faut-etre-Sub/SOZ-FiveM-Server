import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { useCallback, useMemo } from 'react';

import { APPS, IApp } from '../config/apps';

export const useApps = () => {
    const { icons } = useNotifications();

    const apps: IApp[] = useMemo(() => {
        return APPS.map(app => {
            return {
                ...app,
                notification: icons.find(i => i.key === app.id),
            };
        });
    }, [icons]);

    const getApp = useCallback(
        (id: string): IApp => apps.find(a => a.id.toLowerCase() === id.toLowerCase()) || null,
        [apps]
    );
    return { apps, getApp };
};

export const useApp = (id: string): IApp => {
    const { getApp } = useApps();
    return getApp(id);
};
