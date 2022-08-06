import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useEffect } from 'react';

import { ServerPromiseResp } from '../../../typings/common';
import { Contact, ContactEvents } from '../../../typings/contact';
import { BrowserContactsState } from '../apps/contacts/utils/constants';
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
