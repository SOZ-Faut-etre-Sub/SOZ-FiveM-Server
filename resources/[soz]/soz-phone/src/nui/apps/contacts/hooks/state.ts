import { ServerPromiseResp } from '@typings/common';
import { Contact, ContactEvents } from '@typings/contact';
import { fetchNui } from '@utils/fetchNui';
import { buildRespObj } from '@utils/misc';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { BrowserContactsState } from '../utils/constants';

export const contactsState = {
    contacts: atom<Contact[]>({
        key: 'contactsList',
        default: selector({
            key: 'contactsListDefault',
            get: async () => {
                try {
                    const resp = await fetchNui<ServerPromiseResp<Contact[]>>(
                        ContactEvents.GET_CONTACTS,
                        undefined,
                        buildRespObj(BrowserContactsState)
                    );
                    return resp.data;
                } catch (e) {
                    return [];
                }
            },
        }),
    }),
    filterInput: atom<string>({
        key: 'filterInput',
        default: '',
    }),
    filteredContacts: selector({
        key: 'filteredContacts',
        get: ({ get }) => {
            const filterInputVal: string = get(contactsState.filterInput);
            let contacts: Contact[] = get(contactsState.contacts);
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

export const useSetContacts = () => useSetRecoilState(contactsState.contacts);
export const useContacts = () => useRecoilState(contactsState.contacts);
export const useContactsValue = () => useRecoilValue(contactsState.contacts);

export const useFilteredContacts = () => useRecoilValue(contactsState.filteredContacts);

export const useContactFilterInput = () => useRecoilState(contactsState.filterInput);
export const useSetContactFilterInput = () => useSetRecoilState(contactsState.filterInput);
