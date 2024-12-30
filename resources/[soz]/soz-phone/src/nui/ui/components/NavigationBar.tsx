import cn from 'classnames';
import { FunctionComponent, memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useEmergency } from '../../hooks/useEmergency';
import { useConfig } from '../../hooks/usePhone';
import { useNotifications } from '../../os/notifications/hooks/useNotifications';

export const NavigationBar: FunctionComponent = memo(() => {
    const navigate = useNavigate();
    const emergency = useEmergency();
    const { pathname } = useLocation();
    const { setBarUncollapsed } = useNotifications();
    const config = useConfig();

    const color = useMemo(() => {
        if (pathname.includes('/camera') || ['/call', '/game-tetris'].includes(pathname)) {
            return 'bg-gray-200';
        } else {
            return config.theme.value === 'dark' ? 'bg-gray-200' : 'bg-ios-800';
        }
    }, [config.theme.value, pathname]);

    const onclickHandler = useCallback(() => {
        if (emergency) {
            return;
        }

        navigate('/', { replace: true });
        setBarUncollapsed(false);
    }, [emergency, navigate, setBarUncollapsed]);

    if (pathname === '/') {
        return null;
    }

    return (
        <div className="flex flex-none w-full justify-center items-center h-7 z-40">
            <div
                className={cn('bg-opacity-70 rounded w-2/4 h-[0.52rem]', color, {
                    'cursor-pointer': !emergency,
                })}
                onClick={onclickHandler}
            />
        </div>
    );
});
