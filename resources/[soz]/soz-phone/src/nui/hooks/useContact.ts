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

    const getFilteredContacts = useCallback(
        search => {
            return contacts
                .filter(
                    contact =>
                        contact?.display?.toLowerCase().includes(search.toLowerCase()) ||
                        contact.number.includes(search)
                )
                .sort((a, b) => {
                    if (a.favorite && !b.favorite) {
                        return -1;
                    } else if (!a.favorite && b.favorite) {
                        return 1;
                    } else {
                        return a.display.localeCompare(b.display);
                    }
                });
        },
        [contacts]
    );

    const getIdByNumber = useCallback(
        (number: string) => {
            return contacts.find(contact => contact.number === number)?.id;
        },
        [contacts]
    );

    return {
        getDisplayByNumber,
        getPictureByNumber,
        getContacts,
        getContact,
        getFilteredContacts,
        getIdByNumber,
    };
};
