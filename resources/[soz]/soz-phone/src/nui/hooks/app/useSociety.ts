import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';

export const useSociety = () => {
    const society = useSelector((state: RootState) => state.appSociety);

    const getContacts = useCallback(() => {
        return society.contacts;
    }, [society]);

    const getContact = useCallback(
        id => {
            return society.contacts.find(contact => contact.id === id);
        },
        [society]
    );

    const getSocietyMessages = useCallback(() => {
        return society.messages;
    }, [society]);

    return {
        getContacts,
        getContact,
        getSocietyMessages,
    };
};
