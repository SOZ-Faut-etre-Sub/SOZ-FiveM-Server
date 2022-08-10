import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { MessageConversation } from '@typings/messages';
import { useNavigate } from 'react-router-dom';

const NOTIFICATION_ID = 'messages:broadcast';

export const useMessageNotifications = () => {
    const navigate = useNavigate();
    const { removeId, addNotification, addNotificationAlert } = useNotifications();
    const { icon: Icon } = useApp('messages');

    const setNotification = ({ conversationName, conversationId, message }) => {
        const group: MessageConversation = null;

        const id = `${NOTIFICATION_ID}:${conversationId}`;

        const notification = {
            app: 'MESSAGES',
            id,
            sound: true,
            title: group?.display || group?.phoneNumber || conversationName,
            onClick: () => navigate(`/messages/conversations/${conversationId}`),
            content: message,
            Icon,
            notificationIcon: Icon,
        };

        addNotificationAlert(notification, n => {
            removeId(id);
            addNotification(n);
        });
    };

    return { setNotification };
};
