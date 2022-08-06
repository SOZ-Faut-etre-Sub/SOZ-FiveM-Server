import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { Message, MessageConversation, MessageEvents } from '@typings/messages';
import { useEffect } from 'react';

import { ServerPromiseResp } from '../../../typings/common';
import { MockConversationMessages, MockMessageConversations } from '../apps/messages/utils/constants';
import { store } from '../store';
import { fetchNui } from '../utils/fetchNui';
import { buildRespObj } from '../utils/misc';

export const useMessagesService = () => {
    useEffect(() => {
        fetchNui<ServerPromiseResp<MessageConversation[]>>(
            MessageEvents.FETCH_MESSAGE_CONVERSATIONS,
            undefined,
            buildRespObj(MockMessageConversations)
        ).then(conversations => {
            store.dispatch.simCard.setConversations(conversations.data);
        });
        fetchNui<ServerPromiseResp<Message[]>>(
            MessageEvents.FETCH_MESSAGES,
            undefined,
            buildRespObj(MockConversationMessages)
        ).then(messages => {
            store.dispatch.simCard.setMessages(messages.data);
        });
    });

    useNuiEvent(
        'MESSAGES',
        MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS,
        store.dispatch.simCard.appendConversation
    );
    // useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
    useNuiEvent('MESSAGES', MessageEvents.SEND_MESSAGE_SUCCESS, store.dispatch.simCard.appendMessage);
};
