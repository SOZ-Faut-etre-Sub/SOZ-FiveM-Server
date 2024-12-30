import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import {
    DarkwebConversation,
    DarkwebConversationArchiveResult,
    DarkwebConversationResult,
    DarkwebConversationUpdateResult,
    DarkwebEvents,
    DarkwebMessage,
    DarkwebParticipantUpdateResult,
    PreDBDarkwebMessage,
} from '@typings/app/darkweb';
import { ServerPromiseResp } from '@typings/common';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { fetchNui } from '../../../common/utils/fetchNui';
import { buildRespObj } from '../../../common/utils/misc';
import { store } from '../../../store';
import { MockDarkwebConversations, MockDarkwebMessages } from '../utils/constants';

type UseDarkwebAPIProps = {
    sendMessage: ({ conversationId, message }: PreDBDarkwebMessage) => void;
    addConversation: (label: string, password: string) => void;
    updateParticipantRole: (conversationId: number, userIdentifier: string, role: string) => void;
    archiveConversation: (conversationId: number) => void;
    updateConversation: (conversationId: number, label: string, password: string) => void;
    getMessages: (conversationId: number) => void;
    getConversations: () => void;
};

export const UseDarkwebAPI = (): UseDarkwebAPIProps => {
    const { addAlert } = useSnackbar();
    const [t] = useTranslation();
    const navigate = useNavigate();

    const sendMessage = useCallback(
        ({ conversationId, message }: PreDBDarkwebMessage) => {
            fetchNui<ServerPromiseResp<DarkwebMessage>>(DarkwebEvents.SEND_MESSAGE, {
                conversationId,
                message,
            }).then(resp => {
                if (resp.status !== 'ok') {
                    return addAlert({
                        message: t('DARKWEB.FEEDBACK.NEW_MESSAGE_FAILED'),
                        type: 'error',
                    });
                }
                const message: DarkwebMessage = resp.data;
                store.dispatch.appDarkweb.addMessageToConversation(message);
            });
        },
        [t, addAlert]
    );

    const getConversations = useCallback(() => {
        fetchNui<ServerPromiseResp<DarkwebConversation[]>>(
            DarkwebEvents.FETCH_CONVERSATIONS,
            {},
            buildRespObj(MockDarkwebConversations, 'ok')
        ).then(resp => {
            if (resp.status !== 'ok') {
                return addAlert({
                    message: t('DARKWEB.FEEDBACK.FETCH_CONVERSATION_FAILED'),
                    type: 'error',
                });
            }
            const conversations: DarkwebConversation[] = resp.data;
            store.dispatch.appDarkweb.loadDarkwebConversations(conversations);
        });
    }, [t, addAlert]);

    const getMessages = useCallback(
        (conversationId: number) => {
            fetchNui<ServerPromiseResp<DarkwebMessage[]>>(
                DarkwebEvents.FETCH_MESSAGES,
                {
                    conversationId,
                },
                buildRespObj(MockDarkwebMessages, 'ok')
            ).then(resp => {
                if (resp.status !== 'ok') {
                    return addAlert({
                        message: t('DARKWEB.FEEDBACK.FETCH_MESSAGES_FAILED'),
                        type: 'error',
                    });
                }
                const messages: DarkwebMessage[] = resp.data;
                store.dispatch.appDarkweb.loadDarkwebMessages(messages);
            });
        },
        [t, addAlert]
    );

    const addConversation = useCallback(
        (label: string, password: string) => {
            fetchNui<ServerPromiseResp<DarkwebConversationResult>>(DarkwebEvents.CREATE_CONVERSATION, {
                label,
                password,
            }).then(resp => {
                if (resp.status === 'error') {
                    return addAlert({
                        message: t('DARKWEB.FEEDBACK.CONVERSATION_CREATE_ONE_NUMBER_FAILED', {
                            label: '',
                        }),
                        type: 'error',
                    });
                }
                if (resp.data.error) {
                    return addAlert({
                        message: resp.data.errorMessage,
                        type: 'error',
                    });
                }
                if (resp.data.conversation && resp.data.conversationParticipants) {
                    store.dispatch.appDarkweb.addConversationSuccess(resp.data.conversation);
                    store.dispatch.appDarkweb.addConversationParticipants(resp.data.conversationParticipants);
                }
            });
        },
        [navigate, addAlert, t]
    );
    const updateParticipantRole = useCallback((conversationId: number, phoneNumber: string, role: string) => {
        fetchNui<ServerPromiseResp<DarkwebParticipantUpdateResult>>(DarkwebEvents.UPDATE_PARTICIPANT_ROLE, {
            conversationId,
            phoneNumber,
            role,
        }).then(resp => {
            if (resp.status === 'error') {
                return addAlert({
                    message: t('DARKWEB.FEEDBACK.EDIT_PARTITIPANT_ROLE', {
                        label: '',
                    }),
                    type: 'error',
                });
            }
            if (resp.data.participant) {
                store.dispatch.appDarkweb.updateDarkwebParticipantRole(resp.data.participant);
            }
        });
    }, []);

    const archiveConversation = useCallback((conversationId: number) => {
        fetchNui<ServerPromiseResp<DarkwebConversationArchiveResult>>(DarkwebEvents.ARCHIVE_CONVERSATION, {
            conversationId,
        }).then(resp => {
            if (resp.status === 'error') {
                return addAlert({
                    message: t('DARKWEB.FEEDBACK.ARCHIVE_ERROR', {}),
                    type: 'error',
                });
            }
            if (resp.data.conversation) {
                store.dispatch.appDarkweb.updateConversationInfos(resp.data.conversation);
            }

            navigate(-1);
        });
    }, []);

    const updateConversation = useCallback((conversationId: number, label: string, password: string) => {
        fetchNui<ServerPromiseResp<DarkwebConversationUpdateResult>>(DarkwebEvents.UPDATE_CONVERSATION, {
            conversationId,
            label,
            password,
        }).then(resp => {
            if (resp.status === 'error') {
                return addAlert({
                    message: t('DARKWEB.FEEDBACK.UPDATE ERROR', {}),
                    type: 'error',
                });
            }
            if (resp.data.conversation) {
                store.dispatch.appDarkweb.updateConversationInfos(resp.data.conversation[0]);
            }

            navigate(-1);
        });
    }, []);

    return {
        sendMessage,
        getMessages,
        getConversations,
        addConversation,
        updateParticipantRole,
        archiveConversation,
        updateConversation,
    };
};
