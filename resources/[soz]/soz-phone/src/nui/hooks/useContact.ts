import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../store';

export const useContact = () => {
    const contacts = useSelector((state: RootState) => state.simCard.contacts);

    const getContacts = useCallback(() => {
        return contacts;
    }, [contacts]);

    const getContact = useCallback(
        (id: number) => {
            return contacts.find(contact => contact.id === id);
        },
        [contacts]
    );

    const getDisplayByNumber = useCallback(
        (number: string) => {
            return contacts.find(contact => contact.number === number)?.display ?? number;
        },
        [contacts]
    );

    const getPictureByNumber = useCallback(
        (number: string) => {
            return contacts.find(contact => contact.number === number)?.avatar;
        },
        [contacts]
    );

    return {
        getDisplayByNumber,
        getPictureByNumber,
        getContacts,
        getContact,
    };
};
