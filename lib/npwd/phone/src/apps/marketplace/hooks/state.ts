import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ServerPromiseResp } from '@typings/common';
import {
  MarketplaceEvents,
  MarketplaceListing,
  MarketplaceListingBase,
} from '@typings/marketplace';
import { fetchNui } from '../../../utils/fetchNui';
import { isEnvBrowser } from '../../../utils/misc';

const defaultData: MarketplaceListing[] = [
  {
    id: 1,
    name: 'Some guy',
    number: '111-1134',
    username: 'Taso',
    title: 'eeeeeeeeeeeeeeeeeeeeeeeee',
    description:
      'skldfsdEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    url: 'https://i.file.glass/706Y3.jpeg',
  },
  {
    id: 2,
    name: 'Some other dude',
    number: '666-6666',
    username: 'Taso',
    title: 'Material',
    description: 'Selling my wife',
    url: '',
  },
];

export const listingState = atom<MarketplaceListing[]>({
  key: 'listings',
  default: selector({
    key: 'defaultListings',
    get: async () => {
      try {
        const resp = await fetchNui<ServerPromiseResp<MarketplaceListing[]>>(
          MarketplaceEvents.FETCH_LISTING,
        );
        return resp.data;
      } catch (e) {
        if (isEnvBrowser()) {
          return defaultData;
        }
        console.error(e);
        return [];
      }
    },
  }),
});

export const formState = atom<MarketplaceListingBase>({
  key: 'form',
  default: {
    title: '',
    description: '',
    url: '',
  },
});

export const useListingValue = () => useRecoilValue(listingState);
export const useSetListings = () => useSetRecoilState(listingState);
export const useListings = () => useRecoilState(listingState);

export const useFormValue = () => useRecoilValue(formState);
export const useSetForm = () => useSetRecoilState(formState);
export const useForm = () => useRecoilState(formState);
