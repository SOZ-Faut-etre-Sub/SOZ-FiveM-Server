import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../store';

export const useMessage = () => {
    const messages = useSelector((state: RootState) => state.simCard.messages);

    const getMessages = useCallback(
        conversationId => {
            return messages.filter(message => message.conversation_id === conversationId);
        },
        [messages]
    );

    const getConversations = useCallback(() => {
        return messages;
    }, [messages]);

    const getConversation = useCallback(
        conversationId => {
            return messages.find(message => message.conversation_id === conversationId);
        },
        [messages]
    );

    return {
        getMessages,
        getConversation,
        getConversations,
    };
};
