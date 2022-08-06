import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NOTIFICATION_ID = 'society-messages:broadcast';

export const useMessageNotifications = () => {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const { removeId, addNotification, addNotificationAlert } = useNotifications();
    const { icon, notificationIcon } = useApp('society-messages');

    // Remove notifications from groups when opening them
    // history.listen(location => {
    //     if (
    //         matchPath(location.pathname, {
    //             path: `/society-messages`,
    //             exact: true,
    //         })
    //     ) {
    //         removeId(`${NOTIFICATION_ID}`);
    //     }
    // });

    const setNotification = ({ message = '' }) => {
        const notification = {
            app: 'SOCIETY_MESSAGE',
            NOTIFICATION_ID,
            sound: true,
            title: t('SOCIETY_MESSAGES.NOTIFICATION.TITLE'),
            onClick: () => navigate(`/society-messages`),
            content: message,
            icon,
            notificationIcon,
        };

        addNotificationAlert(notification, n => {
            removeId(NOTIFICATION_ID);
            addNotification(n);
        });
    };

    return { setNotification };
};
