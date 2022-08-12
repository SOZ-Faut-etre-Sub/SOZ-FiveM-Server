import { useLocation } from 'react-router-dom';

import { useConfig } from '../../hooks/usePhone';

export const useBackground = (): string => {
    const config = useConfig();
    const { pathname } = useLocation();

    if (pathname.includes('/camera')) {
        return 'bg-black';
    }
    if (pathname !== '/') {
        return config.theme.value === 'dark' ? 'bg-black' : 'bg-ios-50';
    }
    return '';
};
