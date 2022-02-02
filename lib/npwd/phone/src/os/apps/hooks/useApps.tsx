import React, { useCallback, useMemo } from 'react';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { createLazyAppIcon } from '../utils/createLazyAppIcon';
import { APPS, IApp } from '../config/apps';


export const useApps = () => {
  const { icons } = useNotifications();

  const apps: IApp[] = useMemo(() => {
    return APPS.map((app) => {
      const SvgIcon = React.lazy<any>(() =>
        import(`${__dirname}/../icons/svg/${app.id}`).catch(
          () => 'Was not able to find a dynamic import for icon from this icon set',
        ),
      );
      const AppIcon = React.lazy<any>(() =>
        import(`${__dirname}/../icons/app/${app.id}`).catch(
          () => 'Was not able to find a dynamic import for icon from this icon set',
        ),
      );

      const NotificationIcon = createLazyAppIcon(SvgIcon);
      const Icon = createLazyAppIcon(AppIcon, {className: "h-16 w-16 rounded-[1rem]"});

      return {
        ...app,
        notification: icons.find((i) => i.key === app.id),
        NotificationIcon,
        notificationIcon: <NotificationIcon />,
        icon: <Icon />,
      };
    });
  }, [icons]);

  const getApp = useCallback((id: string): IApp => apps.find((a) => a.id === id) || null, [apps]);
  return { apps, getApp };
};

export const useApp = (id: string): IApp => {
  const { getApp } = useApps();
  return getApp(id);
};
