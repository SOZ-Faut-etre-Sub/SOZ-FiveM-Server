import { useNotifications } from '@os/notifications/hooks/useNotifications';
import React, { memo, useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ThemeContext } from '../../../styles/themeProvider';

export const Navigation = memo(() => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { setBarUncollapsed } = useNotifications();
    const { theme } = useContext(ThemeContext);

    const color = useCallback(() => {
        if (pathname.includes('/camera') || pathname === '/' || pathname === '/call') {
            return 'bg-gray-200';
        } else {
            return theme === 'dark' ? 'bg-gray-200' : 'bg-black';
        }
    }, [theme, pathname]);

    return (
        <div className="absolute bottom-0 inset-x-px flex justify-center h-5 z-50">
            <div
                className={`${color()} bg-opacity-70 rounded-full cursor-pointer h-[0.53rem] w-2/5 transition-colors ease-in-out duration-300`}
                onClick={() => {
                    navigate('/', { replace: true });
                    setBarUncollapsed(false);
                }}
            />
        </div>
    );
});
