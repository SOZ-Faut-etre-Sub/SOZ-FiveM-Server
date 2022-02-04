import {atom, selector, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {Society} from '@typings/society';
import {SocietyContactsState} from '../utils/constants';

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
        get: ({get}) => {
            const filterInputVal: string = get(contactsState.filterInput);
            let contacts: Society[] = get(contactsState.contacts);
            let listedContact = [];

            if (filterInputVal) {
                const regExp = new RegExp(filterInputVal, 'gi');
                contacts = contacts.filter(
                    (contact) => contact.display.match(regExp) || contact.number.match(regExp),
                )
            }

            contacts.forEach(contact => {
                if (listedContact[contact.display[0]] === undefined) {
                    listedContact[contact.display[0]] = []
                }
                listedContact[contact.display[0]].push(contact)
            })

            return listedContact;
        },
    }),
};

export const useSetContacts = () => useSetRecoilState(contactsState.contacts);
export const useContacts = () => useRecoilState(contactsState.contacts);
export const useContactsValue = () => useRecoilValue(contactsState.contacts);

export const useFilteredContacts = () => useRecoilValue(contactsState.filteredContacts);

export const useContactFilterInput = () => useRecoilState(contactsState.filterInput);
export const useSetContactFilterInput = () => useSetRecoilState(contactsState.filterInput);
