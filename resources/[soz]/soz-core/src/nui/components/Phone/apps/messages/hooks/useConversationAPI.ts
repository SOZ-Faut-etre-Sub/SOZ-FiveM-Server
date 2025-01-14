import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event/nui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { MessageConversation, NewMessageConversation } from '../../../../../../shared/phone/simcard';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';

type UseConversationAPIProps = {
    addConversation: (conversation: NewMessageConversation) => void;
    archiveConversation: (conversation: MessageConversation) => void;
};

export const useConversationAPI = (): UseConversationAPIProps => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { addNotification } = useNotifications();

    const addConversation = useCallback(
        async (conversation: NewMessageConversation) => {
            try {
                const resp = await fetchNui<NewMessageConversation, MessageConversation>(
                    NuiEvent.PhoneSimCardAddConversation,
                    conversation
                );
                navigate(`/messages/${resp.conversation_id}`);
            } catch (e) {
                addNotification({
                    app: 'messages',
                    title: t('MESSAGES.FEEDBACK.CONVERSATION_CREATE_ONE_NUMBER_FAILED', {
                        number: conversation.phoneNumber,
                    }),
                });
                navigate('/messages');
            }
        },
        [navigate, addNotification, t]
    );

    const archiveConversation = useCallback(
        async (conversation: MessageConversation) => {
            try {
                await fetchNui<string, MessageConversation>(
                    NuiEvent.PhoneSimCardArchiveConversation,
                    conversation.conversation_id
                );
            } catch (e) {
                addNotification({
                    app: 'messages',
                    title: t('MESSAGES.FEEDBACK.ARCHIVE_CONVERSATION_FAILED'),
                });
            }
            navigate('/messages');
        },
        [navigate, addNotification, t]
    );

    return {
        addConversation,
        archiveConversation,
    };
};
