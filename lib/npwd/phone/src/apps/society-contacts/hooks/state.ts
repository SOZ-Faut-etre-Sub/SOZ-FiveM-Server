import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Contact } from '@typings/contact';
import { SocietyContactsState } from '../utils/constants';

export const contactsState = {
  contacts: atom<Contact[]>({
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
      const contacts: Contact[] = get(contactsState.contacts);

      if (!filterInputVal) return contacts;

      const regExp = new RegExp(filterInputVal, 'gi');

      return contacts.filter(
        (contact) => contact.display.match(regExp) || contact.number.match(regExp),
      );
    },
  }),
};

export const useSetContacts = () => useSetRecoilState(contactsState.contacts);
export const useContacts = () => useRecoilState(contactsState.contacts);
export const useContactsValue = () => useRecoilValue(contactsState.contacts);

export const useFilteredContacts = () => useRecoilValue(contactsState.filteredContacts);

export const useContactFilterInput = () => useRecoilState(contactsState.filterInput);
export const useSetContactFilterInput = () => useSetRecoilState(contactsState.filterInput);
