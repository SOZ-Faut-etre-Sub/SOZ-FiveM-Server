import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { MessageConversation, MessageEvents } from '@typings/messages';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useMessageNotifications } from '../apps/messages/hooks/useMessageNotifications';
import { useVisibility } from '../hooks/usePhone';
import { store } from '../store';

export const useMessagesService = () => {
    const { visibility } = useVisibility();
    const { pathname } = useLocation();
    const { setNotification, setNotificationSilent } = useMessageNotifications();

    useEffect(() => {
        store.dispatch.simCard.loadConversations((conversations: MessageConversation[]) => {
            for (const conversation of conversations) {
                if (conversation.unread > 0) {
                    setNotificationSilent({
                        conversationName: conversation.display,
                        conversationId: conversation.conversation_id,
                        message: `Message${conversation.unread > 1 ? 's' : ''} en absence`,
                    });
                }
            }
        });
        store.dispatch.simCard.loadMessages();
    }, []);

    const handleMessageBroadcast = ({ conversationName, conversationId, message }) => {
        if (visibility && pathname.includes('/messages/conversations')) {
            return;
        }

        setNotification({ conversationName, conversationId, message });
    };

    useNuiEvent(
        'MESSAGES',
        MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS,
        store.dispatch.simCard.appendConversation
    );
    useNuiEvent(
        'MESSAGES',
        MessageEvents.UPDATE_MESSAGE_CONVERSATION_SUCCESS,
        store.dispatch.simCard.updateConversation
    );
    useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
    useNuiEvent('MESSAGES', MessageEvents.SEND_MESSAGE_SUCCESS, store.dispatch.simCard.appendMessage);
};
