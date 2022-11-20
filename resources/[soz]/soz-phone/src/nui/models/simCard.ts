import { createModel } from '@rematch/core';

import { ActiveCall, CallEvents, CallHistoryItem } from '../../../typings/call';
import { ServerPromiseResp } from '../../../typings/common';
import { Contact, ContactEvents } from '../../../typings/contact';
import { Message, MessageConversation, MessageEvents } from '../../../typings/messages';
import { BrowserContactsState } from '../apps/contacts/utils/constants';
import { MockHistoryData } from '../apps/dialer/utils/constants';
import { MockConversationMessages, MockMessageConversations } from '../apps/messages/utils/constants';
import { fetchNui } from '../utils/fetchNui';
import { buildRespObj } from '../utils/misc';
import { RootModel } from '.';

export const simCard = createModel<RootModel>()({
    state: {
        number: null,
        societyNumber: null,
        call: null as ActiveCall,
        callHistory: [] as CallHistoryItem[],
        contacts: [] as Contact[],
        conversations: [] as MessageConversation[],
        messages: [] as Message[],
    },
    reducers: {
        SET_NUMBER: (state, payload) => {
            return { ...state, number: payload };
        },
        SET_SOCIETY_NUMBER: (state, payload) => {
            return { ...state, societyNumber: payload };
        },
        SET_CALL(state, payload: ActiveCall) {
            return { ...state, call: payload };
        },
        SET_CALL_MUTE(state, payload: boolean) {
            if (!state.call) {
                return state;
            }

            return { ...state, call: { ...state.call, muted: payload } };
        },
        SET_CALL_HISTORY(state, payload: CallHistoryItem[]) {
            return { ...state, callHistory: payload };
        },
        ADD_CALL_HISTORY(state, payload: CallHistoryItem) {
            return { ...state, callHistory: [payload, ...state.callHistory] };
        },
        UPDATE_CALL_HISTORY(state, payload: CallHistoryItem) {
            return { ...state, callHistory: state.callHistory.map(item => (item.id === payload.id ? payload : item)) };
        },
        SET_CONTACT(state, payload: Contact[]) {
            return { ...state, contacts: payload };
        },
        ADD_CONTACT(state, payload: Contact) {
            return { ...state, contacts: [...state.contacts, payload] };
        },
        UPDATE_CONTACT(state, payload: Contact) {
            return {
                ...state,
                contacts: state.contacts.map(contact => (contact.id === payload.id ? payload : contact)),
            };
        },
        DELETE_CONTACT(state, payload: number) {
            return { ...state, contacts: state.contacts.filter(contact => contact.id !== payload) };
        },
        SET_CONVERSATIONS(state, payload: MessageConversation[]) {
            return { ...state, conversations: payload };
        },
        ADD_CONVERSATION(state, payload: MessageConversation) {
            if (state.conversations.find(conversation => conversation.conversation_id === payload.conversation_id)) {
                return state;
            }

            return { ...state, conversations: [{ ...payload, unread: 1 }, ...state.conversations] };
        },
        UPDATE_CONVERSATION(state, payload: MessageConversation) {
            if (!state.conversations.find(conversation => conversation.conversation_id === payload.conversation_id)) {
                return { ...state, conversations: [{ ...payload, unread: 1 }, ...state.conversations] };
            }

            return {
                ...state,
                conversations: state.conversations.map(conversation =>
                    conversation.conversation_id === payload.conversation_id
                        ? { ...payload, masked: false, unread: conversation.unread + payload.unread }
                        : conversation
                ),
            };
        },
        SET_CONVERSATION_AS_ARCHIVED: (state, payload: string) => {
            if (!state.conversations.find(conversation => conversation.conversation_id === payload)) {
                return state;
            }

            return {
                ...state,
                conversations: state.conversations.map(conversation =>
                    conversation.conversation_id === payload ? { ...conversation, masked: true } : conversation
                ),
            };
        },
        SET_CONVERSATION_AS_READ(state, payload: string) {
            if (!state.conversations.find(conversation => conversation.conversation_id === payload)) {
                return state;
            }

            return {
                ...state,
                conversations: state.conversations.map(conversation =>
                    conversation.conversation_id === payload
                        ? { ...conversation, masked: false, unread: 0 }
                        : conversation
                ),
            };
        },
        SET_MESSAGES(state, payload: Message[]) {
            return { ...state, messages: payload };
        },
        ADD_MESSAGE(state, payload: Message) {
            return { ...state, messages: [payload, ...state.messages] };
        },
    },
    effects: dispatch => ({
        async setCall(payload: ActiveCall) {
            dispatch.simCard.SET_CALL(payload);
        },
        async setCallMute(payload: boolean) {
            dispatch.simCard.SET_CALL_MUTE(payload);
        },
        async setCallHistory(payload: CallHistoryItem[]) {
            dispatch.simCard.SET_CALL_HISTORY(payload);
        },
        async appendCallHistory(payload: CallHistoryItem) {
            dispatch.simCard.ADD_CALL_HISTORY(payload);
        },
        async updateCallHistory(payload: CallHistoryItem) {
            dispatch.simCard.UPDATE_CALL_HISTORY(payload);
        },
        async setContacts(payload: Contact[]) {
            dispatch.simCard.SET_CONTACT(payload);
        },
        async appendContact(payload: Contact) {
            dispatch.simCard.ADD_CONTACT(payload);
        },
        async updateContact(payload: Contact) {
            dispatch.simCard.UPDATE_CONTACT(payload);
        },
        async deleteContact(payload: number) {
            dispatch.simCard.DELETE_CONTACT(payload);
        },
        async setConversations(payload: MessageConversation[]) {
            dispatch.simCard.SET_CONVERSATIONS(payload);
        },
        async appendConversation(payload: MessageConversation) {
            dispatch.simCard.ADD_CONVERSATION(payload);
        },
        async updateConversation(payload: MessageConversation) {
            dispatch.simCard.UPDATE_CONVERSATION(payload);
        },
        async setMessages(payload: Message[]) {
            dispatch.simCard.SET_MESSAGES(payload);
        },
        async appendMessage(payload: Message) {
            dispatch.simCard.ADD_MESSAGE(payload);
        },
        // loader
        async loadCallHistory() {
            fetchNui<ServerPromiseResp<CallHistoryItem[]>>(
                CallEvents.FETCH_CALLS,
                undefined,
                buildRespObj(MockHistoryData)
            ).then(calls => {
                dispatch.simCard.SET_CALL_HISTORY(calls.data || []);
            });
        },
        async loadContacts() {
            fetchNui<ServerPromiseResp<Contact[]>>(
                ContactEvents.GET_CONTACTS,
                undefined,
                buildRespObj(BrowserContactsState)
            ).then(calls => {
                dispatch.simCard.SET_CONTACT(calls.data || []);
            });
        },
        async loadConversations() {
            fetchNui<ServerPromiseResp<MessageConversation[]>>(
                MessageEvents.FETCH_MESSAGE_CONVERSATIONS,
                undefined,
                buildRespObj(MockMessageConversations)
            ).then(conversations => {
                dispatch.simCard.SET_CONVERSATIONS(conversations.data || []);
            });
        },
        async setConversationArchived(conversation_id) {
            fetchNui<ServerPromiseResp<any>>(MessageEvents.SET_CONVERSATION_ARCHIVED, {
                conversation_id: conversation_id,
            }).then(() => {
                dispatch.simCard.SET_CONVERSATION_AS_ARCHIVED(conversation_id);
            });
        },
        async setConversationAsRead(conversation_id) {
            fetchNui<ServerPromiseResp<any>>(MessageEvents.SET_MESSAGE_READ, {
                conversation_id: conversation_id,
            }).then(() => {
                dispatch.simCard.SET_CONVERSATION_AS_READ(conversation_id);
            });
        },
        async loadMessages() {
            fetchNui<ServerPromiseResp<Message[]>>(
                MessageEvents.FETCH_MESSAGES,
                undefined,
                buildRespObj(MockConversationMessages)
            ).then(messages => {
                dispatch.simCard.SET_MESSAGES(messages.data || []);
            });
        },
    }),
});
