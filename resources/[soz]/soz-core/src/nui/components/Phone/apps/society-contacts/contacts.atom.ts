import { SocietyContact } from '@public/shared/phone/apps/society';
import { atom } from 'jotai';

import { Separator } from '../../../../../shared/phone/simcard';
import { societyContacts } from './contacts.constant';

export const contactsAtom = atom<Array<SocietyContact>>(societyContacts);
export const contactSearchQueryAtom = atom<string>('');
export const filteredContactsAtom = atom<Array<SocietyContact | Separator>>(get => {
    const contacts = get(contactsAtom);
    const searchQuery = get(contactSearchQueryAtom);

    let lastType = '';
    const contactList: (SocietyContact | Separator)[] = [];
    const typeOrder = ['urgence', 'public', 'private'];

    contacts
        .filter(
            contact =>
                contact?.display?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact?.number?.includes(searchQuery)
        )
        .sort((a, b) => {
            if (a.type && !b.type) {
                return -1;
            } else if (!a.type && b.type) {
                return 1;
            } else if (a.type && b.type) {
                return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
            } else {
                return a.display.localeCompare(b.display);
            }
        })
        .forEach(contact => {
            let type: string;

            if (contact.type === 'public') {
                type = 'Entreprise Publique';
            } else if (contact.type === 'private') {
                type = 'Entreprise Privée';
            } else {
                type = 'Urgence';
            }

            if (type !== lastType) {
                contactList.push({
                    separator: true,
                    display: type.toUpperCase(),
                });
                lastType = type;
            }
            contactList.push(contact);
        });

    return contactList;
});
