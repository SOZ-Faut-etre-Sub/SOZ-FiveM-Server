import {contactsState} from './state';

import {Society} from '@typings/society';
import {useRecoilCallback} from 'recoil';

interface UseContactsValue {
  getContact: (id: number) => Society | null;
}

export const useContactActions = (): UseContactsValue => {
  const getContact = useRecoilCallback<[number], Society | null>(
    ({snapshot}) =>
      (id: number) => {
        const {state, contents} = snapshot.getLoadable(contactsState.contacts);
        if (state !== 'hasValue') return null;

        for (const contact of contents) {
          if (contact.id === id) return contact;
        }
        return null;
      },
    [],
  );

  return {
    getContact,
  };
};
