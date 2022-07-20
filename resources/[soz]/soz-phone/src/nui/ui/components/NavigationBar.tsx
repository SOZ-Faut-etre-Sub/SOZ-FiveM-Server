import cn from 'classnames';
import { FunctionComponent, memo, useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useNotifications } from '../../os/notifications/hooks/useNotifications';
import { ThemeContext } from '../../styles/themeProvider';

export const NavigationBar: FunctionComponent = memo(() => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { setBarUncollapsed } = useNotifications();
    const { theme } = useContext(ThemeContext);

    const color = useCallback(() => {
        if (pathname.includes('/camera') || pathname === '/') {
            return 'bg-gray-200';
        } else {
            return theme === 'dark' ? 'bg-gray-200' : 'bg-black';
        }
    }, [theme, pathname]);

    if (pathname === '/call') {
        return null;
    }

    return (
        <div className="absolute flex bottom-0 left-0 right-0 w-full justify-center h-5 z-40">
            <div
                className={cn('bg-opacity-70 rounded w-2/4 h-[0.52rem] cursor-pointer', color())}
                onClick={() => {
                    navigate('/', { replace: true });
                    setBarUncollapsed(false);
                }}
            />
        </div>
    );
});
