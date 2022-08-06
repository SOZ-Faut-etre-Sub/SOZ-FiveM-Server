import { Society } from '@typings/society';
import { atom, selector } from 'recoil';

import { SocietyContactsState } from '../utils/constants';

export const contactsState = {
    contacts: atom<Society[]>({
        key: 'societyContactsList',
        default: SocietyContactsState,
    }),
    filterInput: atom<string>({
        key: 'societyFilterInput',
        default: '',
    }),
    filteredContacts: selector({
        key: 'societyFilteredContacts',
        get: ({ get }) => {
            const filterInputVal: string = get(contactsState.filterInput);
            let contacts: Society[] = get(contactsState.contacts);
            const listedContact = [];

            if (filterInputVal) {
                const regExp = new RegExp(filterInputVal.replace(/[^a-zA-Z\d]/g, ''), 'gi');
                contacts = contacts.filter(contact => contact.display.match(regExp) || contact.number.match(regExp));
            }

            contacts.forEach(contact => {
                if (listedContact[contact.display[0]] === undefined) {
                    listedContact[contact.display[0]] = [];
                }
                listedContact[contact.display[0]].push(contact);
            });

            return listedContact;
        },
    }),
};
