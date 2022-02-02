import React from 'react';
import { usePhone } from '@os/phone/hooks/usePhone';

import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';

interface NotificationProps {
  open: boolean;
  handleClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ children, handleClose, open }) => {
  const { ResourceConfig } = usePhone();

  const currentTheme = usePhoneTheme();

  if (!ResourceConfig) return null;

  const { horizontal, vertical } = ResourceConfig.notificationPosition;

  return (
    <div>
      <div>
        <div >
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
