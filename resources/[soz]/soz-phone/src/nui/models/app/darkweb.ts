import { createModel } from '@rematch/core';
import {
    DarkwebConversation,
    DarkwebEvents,
    DarkwebMessage,
    DarkwebParticipant,
    DarkwebState,
} from '@typings/app/darkweb';

import { ServerPromiseResp } from '../../../../typings/common';
import { MockDarkwebParticipants } from '../../apps/darkweb/utils/constants';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';
import { RootModel } from '..';

export const appDarkweb = createModel<RootModel>()({
    state: {
        conversations: [] as DarkwebConversation[],
        messages: [] as DarkwebMessage[],
        participants: [] as DarkwebParticipant[],
        lastMessageSend: 0 as number,
    } as DarkwebState,
    reducers: {
        SET_MESSAGES: (state, payload) => {
            return { ...state, messages: payload };
        },
        SET_CONVERSATIONS: (state, payload) => {
            return { ...state, conversations: payload };
        },
        SET_PARTICIPANTS: (state, payload) => {
            return { ...state, participants: payload.data };
        },
        ADD_CONVERSATION: (state, payload: DarkwebConversation) => {
            if (state.conversations.find(elem => elem.id == payload.id)) {
                return { ...state };
            }

            return { ...state, conversations: [...state.conversations, payload] };
        },
        ADD_MESSAGE: (state, payload) => {
            const messages = [...state.messages, ...payload.message];
            return { ...state, messages: messages };
        },
        UPDATE_LAST_MESSAGE_SEND: (state, payload) => {
            return { ...state, lastMessageSend: payload };
        },
        UPDATE_PARTICIPANTS: (state, payload: DarkwebParticipant[]) => {
            return { ...state, participants: [...state.participants, ...payload] };
        },
        UPDATE_PARTICIPANT: (state, payload) => {
            const index = state.participants.findIndex(
                participant =>
                    participant.conversation_id === payload.conversation_id &&
                    participant.phoneNumber === payload.phoneNumber
            );

            let newArray = [...state.participants];
            if (newArray[index]) {
                newArray[index] = payload;
            } else {
                newArray = [...newArray, payload];
            }

            return {
                ...state,
                participants: newArray,
            };
        },
        UPDATE_CONVERSATION: (state, payload) => {
            const index = state.conversations.findIndex(conversation => conversation.id === payload.id);
            const newArray = [...state.conversations];
            newArray[index] = payload;
            return {
                ...state,
                conversations: newArray,
            };
        },
        SET_CONVERSATION_AS_READ(state, payload: { conversationId: number; phoneNumber: string }) {
            if (
                !state.conversations.find(
                    conversation =>
                        conversation.id === payload.conversationId && conversation.phoneNumber === payload.phoneNumber
                )
            ) {
                return state;
            }

            return {
                ...state,
                conversations: state.conversations.map(conversation =>
                    conversation.id === payload.conversationId && conversation.phoneNumber === payload.phoneNumber
                        ? { ...conversation, unread: 0 }
                        : conversation
                ),
            };
        },
    },
    effects: dispatch => ({
        // loader
        async loadDarkwebConversations(payload: DarkwebConversation[]) {
            dispatch.appDarkweb.SET_CONVERSATIONS(payload || []);
        },

        async loadDarkwebParticipants() {
            fetchNui<ServerPromiseResp<DarkwebParticipant[]>>(
                DarkwebEvents.FETCH_PARTICIPANTS,
                {},
                buildRespObj(MockDarkwebParticipants, 'ok')
            )
                .then(participants => {
                    dispatch.appDarkweb.SET_PARTICIPANTS(participants || []);
                })

                .catch(() => console.error('Failed to load darkweb conversations'));
        },

        async loadDarkwebMessages(payload: DarkwebMessage[]) {
            dispatch.appDarkweb.SET_MESSAGES(payload || []);
        },

        async addConversationSuccess(payload: DarkwebConversation) {
            dispatch.appDarkweb.ADD_CONVERSATION(payload);
        },

        async addConversationParticipants(payload: DarkwebParticipant[]) {
            dispatch.appDarkweb.UPDATE_PARTICIPANTS(payload);
        },

        async addMessageToConversation(payload: DarkwebMessage) {
            dispatch.appDarkweb.ADD_MESSAGE(payload);
            dispatch.appDarkweb.UPDATE_LAST_MESSAGE_SEND(new Date().getTime());
        },
        async updateDarkwebParticipantRole(payload: DarkwebParticipant) {
            dispatch.appDarkweb.UPDATE_PARTICIPANT(payload);
        },

        async updateConversationInfos(payload: DarkwebConversation) {
            dispatch.appDarkweb.UPDATE_CONVERSATION(payload);
        },

        async setConversationAsRead(payload) {
            fetchNui<ServerPromiseResp<{ conversationId: number; phoneNumber: string }>>(
                DarkwebEvents.SET_CONVERSATION_READ,
                {
                    conversationId: payload.conversationId,
                    phoneNumber: payload.phoneNumber,
                }
            )
                .then(() => {
                    dispatch.appDarkweb.SET_CONVERSATION_AS_READ(payload);
                })
                .catch(e => console.error('Failed to set conversation as read', e));
        },

        async handleMessageBroadcast(payload) {
            dispatch.appDarkweb.ADD_MESSAGE(payload);
        },

        async handleConversationBroadcast(payload) {
            dispatch.appDarkweb.UPDATE_CONVERSATION(payload);
        },

        async handleParticipantsBroadcast(payload) {
            dispatch.appDarkweb.UPDATE_PARTICIPANT(payload);
        },
    }),
});
