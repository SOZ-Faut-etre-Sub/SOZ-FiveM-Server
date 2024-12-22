import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { Contact, ContactSeparator } from '../../../typings/contact';
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

    const getFilteredContacts: (search: string) => (Contact | ContactSeparator)[] = useCallback(
        search => {
            let lastLetter = '';
            const contactList: (Contact | ContactSeparator)[] = [];

            contacts
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
                })
                .forEach(contact => {
                    const letter = (contact.display ? contact.display[0] : '#').toUpperCase();
                    const isFavorite = contact.favorite;

                    if (isFavorite && lastLetter !== '★') {
                        contactList.push({
                            separator: true,
                            display: 'Favoris',
                        });
                        lastLetter = '★';
                    }

                    if (!isFavorite && letter !== lastLetter) {
                        contactList.push({
                            separator: true,
                            display: letter,
                        });
                        lastLetter = letter;
                    }
                    contactList.push(contact);
                });

            return contactList;
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
