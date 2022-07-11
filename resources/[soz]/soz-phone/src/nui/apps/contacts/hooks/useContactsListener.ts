import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useApps } from '@os/apps/hooks/useApps';
import { AddContactExportData, ContactEvents, ContactsDatabaseLimits } from '@typings/contact';
import qs from 'qs';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useContactActions } from './useContactActions';

export const useContactsListener = () => {
    const { getContactByNumber } = useContactActions();
    const navigate = useNavigate();
    const { getApp } = useApps();

    const addContactExportHandler = useCallback(
        (contactData: AddContactExportData) => {
            const contact = getContactByNumber(contactData.number);
            const { path } = getApp('CONTACTS');

            const queryData = qs.stringify({
                addNumber: contactData.number.slice(0, ContactsDatabaseLimits.number),
                name: contactData.name?.slice(0, ContactsDatabaseLimits.display),
            });

            if (!contact) {
                return navigate({
                    pathname: `${path}/-1`,
                    search: `?${queryData}`,
                });
            }

            navigate({
                pathname: `${path}/${contact.id}`,
                search: `?${queryData}`,
            });
        },
        [getApp, getContactByNumber, history]
    );

    useNuiEvent<AddContactExportData>('CONTACTS', ContactEvents.ADD_CONTACT_EXPORT, addContactExportHandler);
};
