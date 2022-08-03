import { createModel } from '@rematch/core';

import { CallHistoryItem } from '../../../typings/call';
import { Contact } from '../../../typings/contact';
import { Message, MessageConversation } from '../../../typings/messages';
import { RootModel } from '.';

export const simCard = createModel<RootModel>()({
    state: {
        callHistory: [] as CallHistoryItem[],
        contacts: [] as Contact[],
        conversations: [] as MessageConversation[],
        messages: [] as Message[],
    },
    reducers: {
        SET_CALL(state, payload: CallHistoryItem[]) {
            return { ...state, callHistory: payload };
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
            return { ...state, conversations: [payload, ...state.conversations] };
        },
        SET_MESSAGES(state, payload: Message[]) {
            return { ...state, messages: payload };
        },
        ADD_MESSAGE(state, payload: Message) {
            return { ...state, messages: [payload, ...state.messages] };
        },
    },
    effects: dispatch => ({
        async setCallHistory(payload: CallHistoryItem[]) {
            dispatch.simCard.SET_CALL(payload);
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
        async setMessages(payload: Message[]) {
            dispatch.simCard.SET_MESSAGES(payload);
        },
        async appendMessage(payload: Message) {
            dispatch.simCard.ADD_MESSAGE(payload);
        },
    }),
});
