import { atom } from 'recoil';
import { ResourceConfig } from '@typings/config';

export const phoneState = {
  availability: atom<boolean>({
    key: 'phoneAvailability',
    default: false,
  }),
  visibility: atom<boolean>({
    key: 'phoneVisibility',
    default: false,
  }),
  resourceConfig: atom<ResourceConfig>({
    key: 'resourceConfig',
    default: null,
  }),
  phoneTime: atom<string>({
    key: 'phoneTime',
    default: null,
  }),
};
