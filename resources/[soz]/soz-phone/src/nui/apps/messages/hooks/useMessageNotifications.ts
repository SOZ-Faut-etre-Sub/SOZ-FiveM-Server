import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { MessageConversation } from '@typings/messages';
import { useLocation, useNavigate } from 'react-router-dom';

import { store } from '../../../store';

const NOTIFICATION_ID = 'messages:broadcast';

export const useMessageNotifications = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { removeId, addNotification, addNotificationAlert } = useNotifications();
    const { icon: Icon } = useApp('messages');

    const setNotification = ({ conversationName, conversationId, message }) => {
        const group: MessageConversation = null;
        const id = `${NOTIFICATION_ID}:${conversationId}`;

        const notification = {
            app: 'messages',
            id,
            sound: true,
            title: group?.display || group?.phoneNumber || conversationName,
            onClick: () => navigate(`/messages/${conversationId}`),
            content: message,
            Icon,
            notificationIcon: Icon,
        };

        addNotificationAlert(notification, n => {
            if (pathname.includes(`/messages/${conversationId}`)) {
                store.dispatch.simCard.setConversationAsRead(conversationId);
            } else {
                removeId(id);
                addNotification(n);
            }
        });
    };

    const removeNotification = (conversationId: string) => {
        removeId(`${NOTIFICATION_ID}:${conversationId}`);
    };

    return { setNotification, removeNotification };
};
