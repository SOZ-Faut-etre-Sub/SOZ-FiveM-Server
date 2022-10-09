import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NOTIFICATION_ID = 'society-messages:broadcast';

export const useMessageNotifications = () => {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const { removeId, addNotification, addNotificationAlert } = useNotifications();
    const { icon: Icon } = useApp('society-messages');

    const setNotification = ({ message = '' }) => {
        const notification = {
            app: 'society-messages',
            id: NOTIFICATION_ID,
            sound: true,
            title: t('SOCIETY_MESSAGES.NOTIFICATION.TITLE'),
            onClick: () => navigate(`/society-messages`),
            content: message,
            Icon,
            notificationIcon: Icon,
        };

        addNotificationAlert(notification, n => {
            removeId(NOTIFICATION_ID);
            addNotification(n);
        });
    };

    return { setNotification };
};
