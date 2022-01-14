import { useTranslation } from 'react-i18next';
import { matchPath, useHistory } from 'react-router-dom';
import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import useMessages from './useMessages';
import { useRecoilValue } from 'recoil';
import { messageState } from './state';
import { MessageConversation } from '@typings/messages';
import { useMessageAPI } from './useMessageAPI';

const NOTIFICATION_ID = 'messages:broadcast';

export const useMessageNotifications = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const { removeId, addNotification, addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MESSAGES');
  const { getMessageConversationById, goToConversation } = useMessages();
  const { addConversation } = useMessageAPI();
  const activeMessageConversation = useRecoilValue(messageState.activeMessageConversation);

  // Remove notifications from groups when opening them
  history.listen((location) => {
    if (
      activeMessageConversation?.conversation_id &&
      matchPath(location.pathname, {
        path: `/messages/conversations/${activeMessageConversation.conversation_id}`,
        exact: true,
      })
    ) {
      removeId(`${NOTIFICATION_ID}:${activeMessageConversation.conversation_id}`);
    }
  });

  const setNotification = ({ conversationName, conversationId, message }) => {
    let group: MessageConversation = null;

    group = getMessageConversationById(conversationId);

    if (!group) {
      addConversation(conversationName);
      group = getMessageConversationById(conversationId);
    }

    const id = `${NOTIFICATION_ID}:${conversationId}`;

    const notification = {
      app: 'MESSAGES',
      id,
      sound: true,
      title: group?.display || group.phoneNumber || conversationName,
      onClick: () => goToConversation(group),
      content: message,
      icon,
      notificationIcon,
    };

    addNotificationAlert(notification, (n) => {
      removeId(id);
      if (group.unread > 1) {
        addNotification({
          ...n,
          title: group.phoneNumber || group?.display,
          content: t('MESSAGES.MESSAGES.UNREAD_MESSAGES', {
            count: group.unread,
          }),
        });
        return;
      }
      addNotification(n);
    });
  };

  return { setNotification };
};
