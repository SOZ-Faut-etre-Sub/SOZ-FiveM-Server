import { useAtomValue } from 'jotai';
import { useAtom } from 'jotai/index';
import { useEffect, useMemo } from 'react';

import { contactsAtom, contactSearchQueryAtom, filteredContactsAtom } from '../contacts.atom';

export const useSocietyContact = (number: string) => {
    const contacts = useAtomValue(contactsAtom);

    return useMemo(() => contacts.find(contact => contact.number === number), [contacts]);
};

export const useSocietyContacts = () => {
    const contacts = useAtomValue(filteredContactsAtom);
    const [searchValue, setSearchValue] = useAtom(contactSearchQueryAtom);

    useEffect(() => {
        return () => setSearchValue('');
    }, []);

    return {
        searchValue,
        setSearchValue,
        contacts,
    };
};
