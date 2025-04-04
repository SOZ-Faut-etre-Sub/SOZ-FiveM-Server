import { fetchNui } from '@public/nui/fetch';
import {
    DarkwebConversation,
    DarkwebMessage,
    DarkwebParticipant,
    PreDBDarkwebMessage,
} from '@public/shared/phone/apps/darkweb';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';
import { conversationsAtom, messagesAtom, participantsAtom } from '../darkweb.atom';

type UseDarkwebAPIProps = {
    fetchConversations: () => Promise<void>;
    createConversation: (label: string, password: string) => Promise<void>;
    updateConversation: (conversationId: number, conversation: Partial<DarkwebConversation>) => Promise<void>;

    setConversationAsRead: (conversationId: number) => void;
    setConversationNotification: (conversationId: number, enabled: boolean) => void;

    fetchMessages: (conversationId: number) => Promise<void>;
    sendMessage: ({ conversationId, message }: PreDBDarkwebMessage) => void;

    fetchParticipants: () => Promise<void>;
    updateParticipantRole: (conversationId: number, userIdentifier: string, role: string) => void;
};

export const useDarkWebAPI = (): UseDarkwebAPIProps => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const setConversations = useSetAtom(conversationsAtom);
    const setMessages = useSetAtom(messagesAtom);
    const setParticipants = useSetAtom(participantsAtom);

    const { addNotification } = useNotifications();

    const fetchConversations = useCallback(async () => {
        try {
            const conversations = await fetchNui<void, DarkwebConversation[]>(
                NuiEvent.PhoneAppDarkWebFetchConversations
            );
            setConversations(conversations);
        } catch (e) {
            addNotification({
                app: 'darkweb',
                title: t('DARKWEB.FEEDBACK.FETCH_CONVERSATION_FAILED'),
            });
        }
    }, []);

    const createConversation = useCallback(async (label: string, password: string) => {
        try {
            await fetchNui(NuiEvent.PhoneAppDarkWebAddConversation, {
                label,
                password,
            });

            await fetchParticipants();
        } catch (e) {
            addNotification({
                app: 'darkweb',
                title: t('DARKWEB.FEEDBACK.CONVERSATION_CREATE_ONE_NUMBER_FAILED', {
                    label: '',
                }),
            });
        }
    }, []);

    const updateConversation = useCallback(
        async (conversationId: number, conversation: Partial<DarkwebConversation>) => {
            try {
                await fetchNui(NuiEvent.PhoneAppDarkWebUpdateConversation, {
                    id: conversationId,
                    ...conversation,
                });

                await fetchConversations();
            } catch (e) {
                addNotification({
                    app: 'darkweb',
                    title: t('DARKWEB.FEEDBACK.UPDATE ERROR'),
                });
            }

            navigate(-1);
        },
        []
    );

    const setConversationAsRead = useCallback(async (conversationId: number) => {
        try {
            await fetchNui(NuiEvent.PhoneAppDarkWebSetConversationAsRead, conversationId);
        } catch (e) {
            addNotification({
                app: 'darkweb',
                title: t('DARKWEB.FEEDBACK.UPDATE ERROR'),
            });
        }
    }, []);

    const setConversationNotification = useCallback(async (conversationId: number, enabled: boolean) => {
        if (!conversationId) return;

        try {
            await fetchNui(NuiEvent.PhoneAppDarkWebUpdateParticipantNotification, { conversationId, enabled });
            await fetchParticipants();
        } catch (e) {
            addNotification({
                app: 'darkweb',
                title: t('DARKWEB.FEEDBACK.UPDATE ERROR'),
            });
        }
    }, []);

    const fetchMessages = useCallback(async (conversationId: number) => {
        try {
            const messages = await fetchNui<number, DarkwebMessage[]>(
                NuiEvent.PhoneAppDarkWebFetchMessages,
                conversationId
            );

            setMessages(messages);
        } catch (e) {
            addNotification({
                app: 'darkweb',
                title: t('DARKWEB.FEEDBACK.FETCH_MESSAGES_FAILED'),
            });
        }
    }, []);

    const sendMessage = useCallback(async ({ conversationId, message }: PreDBDarkwebMessage) => {
        try {
            await fetchNui(NuiEvent.PhoneAppDarkWebSendMessage, {
                conversationId,
                message,
            });

            await fetchMessages(conversationId);
        } catch (e) {
            addNotification({
                app: 'darkweb',
                title: t('DARKWEB.FEEDBACK.NEW_MESSAGE_FAILED'),
            });
        }
    }, []);

    const updateParticipantRole = useCallback(async (conversationId: number, phoneNumber: string, role: string) => {
        try {
            await fetchNui(NuiEvent.PhoneAppDarkWebUpdateParticipantRole, {
                conversationId,
                phoneNumber,
                role,
            });

            await fetchParticipants();
        } catch (e) {
            addNotification({
                app: 'darkweb',
                title: t('DARKWEB.FEEDBACK.EDIT_PARTITIPANT_ROLE', {
                    label: '',
                }),
            });
        }
    }, []);

    const fetchParticipants = useCallback(async () => {
        try {
            const participants = await fetchNui<number, DarkwebParticipant[]>(
                NuiEvent.PhoneAppDarkWebFetchParticipants
            );

            setParticipants(participants);
        } catch (e) {
            addNotification({
                app: 'darkweb',
                title: t('DARKWEB.FEEDBACK.FETCH_MESSAGES_FAILED'),
            });
        }
    }, []);

    return {
        fetchConversations,
        createConversation,
        updateConversation,
        setConversationAsRead,
        setConversationNotification,

        fetchMessages,
        sendMessage,

        fetchParticipants,
        updateParticipantRole,
    };
};
