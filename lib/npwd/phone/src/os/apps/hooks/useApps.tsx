import React, { useCallback, useMemo } from 'react';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { createLazyAppIcon } from '../utils/createLazyAppIcon';
import { APPS, IApp } from '../config/apps';
import { SvgIconComponent } from '@mui/icons-material';
import { useTheme } from '@mui/material';


export const useApps = () => {
  const { icons } = useNotifications();
  const theme = useTheme();

  const apps: IApp[] = useMemo(() => {
    return APPS.map((app) => {
      const SvgIcon = React.lazy<SvgIconComponent>(() =>
        import(`${__dirname}/../icons/svg/${app.id}`).catch(
          () => 'Was not able to find a dynamic import for icon from this icon set',
        ),
      );
      const AppIcon = React.lazy<SvgIconComponent>(() =>
        import(`${__dirname}/../icons/app/${app.id}`).catch(
          () => 'Was not able to find a dynamic import for icon from this icon set',
        ),
      );

      const NotificationIcon = createLazyAppIcon(SvgIcon);
      const Icon = createLazyAppIcon(AppIcon);

      return {
        ...app,
        notification: icons.find((i) => i.key === app.id),
        NotificationIcon,
        notificationIcon: <NotificationIcon htmlColor={app.color} fontSize="small" />,
        icon: <Icon />,
      };
    });
  }, [icons, theme]);

  const getApp = useCallback((id: string): IApp => apps.find((a) => a.id === id) || null, [apps]);
  return { apps, getApp };
};

export const useApp = (id: string): IApp => {
  const { getApp } = useApps();
  return getApp(id);
};
