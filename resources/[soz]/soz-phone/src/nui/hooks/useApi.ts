import { useSelector } from 'react-redux';

import { ApiConfig } from '../../../typings/api';
import { RootState } from '../store';

export const useApiConfig = (): ApiConfig => {
    return useSelector((state: RootState) => state.api);
};
