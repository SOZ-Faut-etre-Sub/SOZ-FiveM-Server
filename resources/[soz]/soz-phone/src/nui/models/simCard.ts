import { createModel } from '@rematch/core';

import { ActiveCall, CallHistoryItem } from '../../../typings/call';
import { Contact } from '../../../typings/contact';
import { Message, MessageConversation } from '../../../typings/messages';
import { RootModel } from '.';

export const simCard = createModel<RootModel>()({
    state: {
        number: null,
        societyNumber: null,
        avatar: null,
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
        SET_AVATAR: (state, payload) => {
            return { ...state, avatar: payload };
        },
        SET_CALL(state, payload: ActiveCall) {
            return { ...state, call: payload };
        },
        SET_CALL_HISTORY(state, payload: CallHistoryItem[]) {
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
        async setCall(payload: ActiveCall) {
            dispatch.simCard.SET_CALL(payload);
        },
        async setCallHistory(payload: CallHistoryItem[]) {
            dispatch.simCard.SET_CALL_HISTORY(payload);
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
            console.log('appendMessage', payload);
            dispatch.simCard.ADD_MESSAGE(payload);
        },
    }),
});
