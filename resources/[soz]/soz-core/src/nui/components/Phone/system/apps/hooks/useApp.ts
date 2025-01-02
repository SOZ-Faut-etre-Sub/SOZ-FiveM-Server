import { useMemo } from 'react';

import { useApps } from './useApps';

export const useApp = (app: string) => {
    const apps = useApps();

    return useMemo(() => apps.find(a => a.id === app), [apps]);
};
