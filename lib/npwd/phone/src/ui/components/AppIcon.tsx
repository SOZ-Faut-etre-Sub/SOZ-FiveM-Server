import React from 'react';
import { useTranslation } from 'react-i18next';
import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import { Button } from './Button';

export interface AppIconProps {
  id: string;
  nameLocale: string;
  Icon: React.ElementType;
  icon: React.ElementType;
  color: string;
  notification: INotificationIcon;
}

export const AppIcon: React.FC<AppIconProps> = ({
  id,
  nameLocale,
  Icon,
  color,
  icon,
  notification,
}) => {
  const [t] = useTranslation();

  return (
    <Button className="flex flex-col justify-self-center w-full">
      {/*<Badge*/}
      {/*  color="error"*/}
      {/*  badgeContent={notification?.badge}*/}
      {/*  invisible={!notification || notification.badge < 2}*/}
      {/*>*/}
        <div className="self-center">
            {icon}

        </div>
      {/*</Badge>*/}
      <p className="flex-nowrap self-center text-white text-sm truncate text-ellipsis w-20">{t(nameLocale)}</p>
    </Button>
  );
};
