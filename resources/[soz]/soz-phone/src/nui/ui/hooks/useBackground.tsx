import { useLocation } from 'react-router-dom';

import { useConfig } from '../../hooks/usePhone';

export const useBackground = (): string => {
    const config = useConfig();
    const { pathname } = useLocation();

    if (pathname.includes('/camera')) {
        return 'bg-black';
    }
    if (pathname !== '/') {
        return config.theme.value === 'dark' ? 'bg-ios-800' : 'bg-ios-50';
    }
    return '';
};
