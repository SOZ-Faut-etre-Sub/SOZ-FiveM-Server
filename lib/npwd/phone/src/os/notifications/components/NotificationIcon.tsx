import React from 'react';
import { NavLink } from 'react-router-dom';

interface INotificationIcon {
  icon: JSX.Element;
  to: string;
}

export const NotificationIcon = ({ icon, to }: INotificationIcon) => {
  return (
    <NavLink to={to} >
      {icon}
    </NavLink>
  );
};
