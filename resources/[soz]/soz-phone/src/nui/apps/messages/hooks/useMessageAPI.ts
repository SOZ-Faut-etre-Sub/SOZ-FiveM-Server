import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { Message, MessageConversationResponse, MessageEvents, PreDBMessage } from '@typings/messages';
import { fetchNui } from '@utils/fetchNui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../../store';

type UseMessageAPIProps = {
    sendMessage: ({ conversationId, message }: PreDBMessage) => void;
    addConversation: (targetNumber: string) => void;
};

export const useMessageAPI = (): UseMessageAPIProps => {
    const { addAlert } = useSnackbar();
    const [t] = useTranslation();
    const navigate = useNavigate();

    const conversations = useSelector((state: RootState) => state.simCard.conversations);

    const sendMessage = useCallback(
        ({ conversationId, message }: PreDBMessage) => {
            fetchNui<ServerPromiseResp<Message>>(MessageEvents.SEND_MESSAGE, {
                conversationId,
                message,
            }).then(resp => {
                if (resp.status !== 'ok') {
                    return addAlert({
                        message: t('MESSAGES.FEEDBACK.NEW_MESSAGE_FAILED'),
                        type: 'error',
                    });
                }
            });
        },
        [t, addAlert]
    );

    const addConversation = useCallback(
        (targetNumber: string) => {
            fetchNui<ServerPromiseResp<MessageConversationResponse>>(MessageEvents.CREATE_MESSAGE_CONVERSATION, {
                targetNumber,
            }).then(resp => {
                if (resp.status === 'error') {
                    navigate('/messages');
                    return addAlert({
                        message: t('MESSAGES.FEEDBACK.CONVERSATION_CREATE_ONE_NUMBER_FAILED', {
                            number: targetNumber,
                        }),
                        type: 'error',
                    });
                }

                navigate(`/messages/${resp.data.conversation_id}`);
            });
        },
        [navigate, addAlert, t, conversations]
    );

    return {
        sendMessage,
        addConversation,
    };
};
