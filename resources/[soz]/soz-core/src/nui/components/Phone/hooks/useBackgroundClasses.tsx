import { useLocation } from 'react-router-dom';

import { useThemeConfig } from '../system/config/config.atom';

export const useBackgroundClasses = (): string => {
    const theme = useThemeConfig();
    const { pathname } = useLocation();

    if (pathname.includes('/camera')) {
        return 'bg-black';
    }

    if (pathname === '/') {
        return '';
    }
    return theme === 'dark' ? 'bg-phone-800' : 'bg-phone-100';
};
