import { atom } from 'recoil';

export const simcardState = {
  number: atom<string | null>({
    key: 'simcardNumber',
    default: null,
  }),
  societyNumber: atom<string | null>({
    key: 'societySimcardNumber',
    default: null,
  }),
  avatar: atom<string | null>({
    key: 'avatar',
    default: null,
  }),
};
