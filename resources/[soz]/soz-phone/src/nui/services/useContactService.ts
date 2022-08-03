import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { IAlert, useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { CallEvents, CallHistoryItem } from '@typings/call';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ServerPromiseResp } from '../../../typings/common';
import { Contact, ContactEvents } from '../../../typings/contact';
import { Message, MessageConversation, MessageEvents } from '../../../typings/messages';
import { BrowserContactsState } from '../apps/contacts/utils/constants';
import { MockHistoryData } from '../apps/dialer/utils/constants';
import { MockConversationMessages, MockMessageConversations } from '../apps/messages/utils/constants';
import { store } from '../store';
import { fetchNui } from '../utils/fetchNui';
import { buildRespObj } from '../utils/misc';

export const useContactService = () => {
    useEffect(() => {
        fetchNui<ServerPromiseResp<Contact[]>>(
            ContactEvents.GET_CONTACTS,
            undefined,
            buildRespObj(BrowserContactsState)
        ).then(calls => {
            store.dispatch.simCard.setContacts(calls.data);
        });
    }, []);

    useNuiEvent('CONTACTS', ContactEvents.ADD_CONTACT_SUCCESS, store.dispatch.simCard.appendContact);
    useNuiEvent('CONTACTS', ContactEvents.UPDATE_CONTACT_SUCCESS, store.dispatch.simCard.updateContact);
    useNuiEvent('CONTACTS', ContactEvents.DELETE_CONTACT_SUCCESS, store.dispatch.simCard.deleteContact);
};
