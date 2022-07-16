import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { ThemeContext } from '../../styles/themeProvider';

export const useBackground = (): string => {
    const { theme } = useContext(ThemeContext);
    const { pathname } = useLocation();

    if (pathname.includes('/camera')) {
        return 'bg-black';
    }
    if (pathname !== '/') {
        return theme === 'dark' ? 'bg-black' : 'bg-ios-50';
    }
    return '';
};
