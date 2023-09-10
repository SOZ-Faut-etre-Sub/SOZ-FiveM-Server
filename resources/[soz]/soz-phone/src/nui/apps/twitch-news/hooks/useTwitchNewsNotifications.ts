import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NOTIFICATION_ID = 'twitch-news:broadcast';

export const useTwitchNewsNotifications = () => {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const { removeId, addNotification, addNotificationAlert } = useNotifications();
    const { icon: Icon } = useApp('twitch-news');

    const setNotification = ({ message = '' }) => {
        const notification = {
            app: 'twitch-news',
            id: NOTIFICATION_ID,
            sound: true,
            title: t('TWITCH_NEWS.NOTIFICATION.TITLE'),
            onClick: () => navigate(`/twitch-news`),
            content: message,
            Icon,
            notificationIcon: Icon,
        };

        addNotificationAlert(notification, n => {
            addNotification(n);
        });
    };

    const removeNotification = () => {
        removeId(NOTIFICATION_ID);
    };

    return { setNotification, removeNotification };
};
