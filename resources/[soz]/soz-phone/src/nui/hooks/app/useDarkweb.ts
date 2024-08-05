import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';

export const useDarkweb = () => {
    const state = useSelector((state: RootState) => state.appDarkweb);

    const getDarkwebConversations = useCallback(() => {
        return state.conversations;
    }, [state.conversations]);

    const getDarkwebConversation = useCallback(
        (id: string) => {
            return state.conversations.find(darkwebConversation => darkwebConversation.id === parseInt(id, 10));
        },
        [state.conversations]
    );

    const getDarkwebConversationParticipants = useCallback(
        id => {
            return state.participants.filter(participant => participant.conversation_id === parseInt(id, 10));
        },
        [state]
    );

    const getDarkwebConversationMessages = useCallback(
        (id: string) => {
            return state.messages.filter(message => message.conversation_id === parseInt(id, 10));
        },
        [state]
    );

    return {
        getDarkwebConversations,
        getDarkwebConversation,
        getDarkwebConversationMessages,
        getDarkwebConversationParticipants,
    };
};
