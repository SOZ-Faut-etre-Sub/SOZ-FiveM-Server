import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { MessageConversation } from '@typings/messages';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NOTIFICATION_ID = 'messages:broadcast';

export const useMessageNotifications = () => {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const { removeId, addNotification, addNotificationAlert } = useNotifications();
    const { icon: Icon } = useApp('messages');
    // const { addConversation } = useMessageAPI();
    // const { getConversation } = useMessage();
    // Remove notifications from groups when opening them
    // history.listen(location => {
    //     if (
    //         activeMessageConversation?.conversation_id &&
    //         matchPath(location.pathname, {
    //             path: `/messages/conversations/${activeMessageConversation.conversation_id}`,
    //             exact: true,
    //         })
    //     ) {
    //         removeId(`${NOTIFICATION_ID}:${activeMessageConversation.conversation_id}`);
    //     }
    // });

    const setNotification = ({ conversationName, conversationId, message }) => {
        const group: MessageConversation = null;

        // group = getConversation(conversationId);
        //
        // if (!group) {
        //     addConversation(conversationName);
        //     group = getConversation(conversationId);
        // }

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
