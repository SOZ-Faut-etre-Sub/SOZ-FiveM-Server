import { useAtomValue } from 'jotai';
import { useAtom } from 'jotai/index';
import { useEffect, useMemo } from 'react';

import { contactsAtom, contactSearchQueryAtom, filteredContactsAtom } from '../sim.card.atom';

export const useContactByID = (id: number) => {
    const contacts = useAtomValue(contactsAtom);

    return useMemo(() => contacts.find(contact => contact.id === id), [contacts]);
};

export const useContact = (number: string) => {
    const contacts = useAtomValue(contactsAtom);

    return useMemo(() => contacts.find(contact => contact.number === number), [contacts]);
};

export const useContacts = () => {
    const contacts = useAtomValue(filteredContactsAtom);
    const [searchValue, setSearchValue] = useAtom(contactSearchQueryAtom);

    useEffect(() => {
        return () => {
            setSearchValue('');
        };
    }, []);

    return {
        searchValue,
        setSearchValue,
        contacts,
    };
};
