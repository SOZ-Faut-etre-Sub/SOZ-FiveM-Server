import { ITransactions } from '@typings/bank';
import { useRecoilValue } from 'recoil';

import { bankState } from './state';

export const useTransactions = () => {
    return useRecoilValue<ITransactions[]>(bankState.transactions);
};
