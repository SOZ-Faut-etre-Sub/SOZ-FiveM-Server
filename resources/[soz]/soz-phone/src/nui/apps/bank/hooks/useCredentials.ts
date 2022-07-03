import { IBankCredentials } from '@typings/bank';
import { useRecoilValue } from 'recoil';

import { bankState } from './state';

export const useCredentials = () => {
    return useRecoilValue<IBankCredentials>(bankState.bankCredentials);
};
