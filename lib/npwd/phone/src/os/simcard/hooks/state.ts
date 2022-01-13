import { atom } from 'recoil';

export const simcardState = {
  number: atom<string | null>({
    key: 'simcardNumber',
    default: null,
  }),
  avatar: atom<string | null>({
    key: 'avatar',
    default: null,
  }),
};
