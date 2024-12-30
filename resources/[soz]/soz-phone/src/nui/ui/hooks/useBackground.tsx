import { useLocation } from 'react-router-dom';

import { useDarkModeEnabled } from '../../hooks/usePhone';

export const useBackground = (): string => {
    const darkModeEnabled = useDarkModeEnabled();
    const { pathname } = useLocation();

    if (pathname.includes('/camera')) {
        return 'bg-black';
    }

    if (pathname === '/') {
        return '';
    }
    return darkModeEnabled ? 'bg-ios-800' : 'bg-ios-50';
};
