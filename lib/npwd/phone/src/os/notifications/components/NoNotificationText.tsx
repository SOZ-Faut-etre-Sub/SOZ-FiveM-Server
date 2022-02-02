import React from 'react';
import { useTranslation } from 'react-i18next';

export const NoNotificationText: React.FC = () => {
  const [t] = useTranslation();

  return (
    <div >
      <div color="textSecondary">
        🎉 {t('NOTIFICATIONS.NO_UNREAD')} 🎉
      </div>
    </div>
  );
};
