import {
    messageState,
    useSetMessageConversations,
    useSetMessages
} from './state';
import {useCallback} from 'react';
import {Message, MessageConversation, MessageEvents} from '@typings/messages';
import {useRecoilValueLoadable} from 'recoil';
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";

interface MessageActionProps {
    updateLocalConversations: (conversation: MessageConversation) => void;
    removeLocalConversation: (conversationId: string[]) => void;
    updateLocalMessages: (messageDto: Message) => void;
    deleteLocalMessage: (messageId: number) => void;
}

export const useMessageActions = (): MessageActionProps => {
    const {state: messageLoading} = useRecoilValueLoadable(messageState.messages);
    const {state: conversationLoading, contents: conversations} = useRecoilValueLoadable(
        messageState.messageCoversations,
    );
    const setMessageConversation = useSetMessageConversations();
    const setMessages = useSetMessages();

    const updateLocalConversations = useCallback(
        (conversation: MessageConversation) => {
            setMessageConversation((curVal) => [conversation, ...curVal]);
        },
        [setMessageConversation],
    );

    const removeLocalConversation = useCallback(
        (conversationsId: string[]) => {
            if (conversationLoading !== 'hasValue') return;

            if (!conversations.length) return;

            setMessageConversation((curVal) =>
                [...curVal].filter(
                    (conversation) => !conversationsId.includes(conversation.conversation_id),
                ),
            );
        },
        [setMessageConversation, conversationLoading, conversations],
    );

    const updateLocalMessages = useCallback(
        (messageDto: Message) => {
            if (messageLoading !== 'hasValue') return;

            setMessages((currVal) => [
                ...currVal,
                {
                    message: messageDto.message,
                    conversation_id: messageDto.conversation_id,
                    author: messageDto.author,
                    id: messageDto.id,
                },
            ]);

            fetchNui<ServerPromiseResp<MessageConversation[]>>(MessageEvents.FETCH_MESSAGE_CONVERSATIONS, undefined).then(resp => {
                setMessageConversation(resp.data);
            });
        },
        [messageLoading, setMessages],
    );

    const deleteLocalMessage = useCallback(
        (messageId: number) => {
            setMessages((currVal) => [...currVal].filter((msg) => msg.id !== messageId));
        },
        [setMessages],
    );

    return {
        updateLocalConversations,
        removeLocalConversation,
        updateLocalMessages,
        deleteLocalMessage,
    };
};
