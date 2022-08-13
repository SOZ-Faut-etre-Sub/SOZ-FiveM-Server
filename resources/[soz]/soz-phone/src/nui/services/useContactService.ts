import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useEffect } from 'react';

import { ContactEvents } from '../../../typings/contact';
import { store } from '../store';

export const useContactService = () => {
    useEffect(() => {
        store.dispatch.simCard.loadContacts();
    }, []);

    useNuiEvent('CONTACTS', ContactEvents.ADD_CONTACT_SUCCESS, store.dispatch.simCard.appendContact);
    useNuiEvent('CONTACTS', ContactEvents.UPDATE_CONTACT_SUCCESS, store.dispatch.simCard.updateContact);
    useNuiEvent('CONTACTS', ContactEvents.DELETE_CONTACT_SUCCESS, store.dispatch.simCard.deleteContact);
};
