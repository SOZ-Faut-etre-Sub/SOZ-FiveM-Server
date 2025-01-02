import { useMemo } from 'react';

import { APPS } from '../apps.constant';

export const useApps = () => {
    return useMemo(() => {
        return APPS;
    }, []);
};
