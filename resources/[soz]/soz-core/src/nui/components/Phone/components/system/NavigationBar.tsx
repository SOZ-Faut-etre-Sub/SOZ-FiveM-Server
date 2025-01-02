import clsx from 'clsx';
import { FunctionComponent, memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useActionSheet } from '../../system/action-sheet/hooks/useActionSheet';
import { useThemeConfig } from '../../system/config/config.atom';
import { useEmergency } from '../../system/emergency/emergency.atom';
import { useNotificationDrawer } from '../../system/notifications/hooks/useNotificationDrawer';

export const NavigationBar: FunctionComponent = memo(() => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const emergency = useEmergency();
    const theme = useThemeConfig();

    const { setDrawerOpen } = useNotificationDrawer();
    const { closeActionSheet } = useActionSheet();

    const color = useMemo(() => {
        if (pathname.includes('/camera') || ['/call', '/game-tetris'].includes(pathname)) {
            return 'bg-gray-200';
        } else {
            return theme === 'dark' ? 'bg-gray-200' : 'bg-ios-800';
        }
    }, [theme, pathname]);

    const onclickHandler = useCallback(() => {
        if (emergency) {
            return;
        }

        navigate('/', { replace: true });
        setDrawerOpen(false);
        closeActionSheet();
    }, [emergency, navigate, setDrawerOpen]);

    if (pathname === '/') {
        return null;
    }

    return (
        <div className="flex flex-none w-full justify-center items-center h-7 z-40">
            <div
                className={clsx('bg-opacity-70 rounded w-2/4 h-[0.52rem]', color, {
                    'cursor-pointer': !emergency,
                })}
                onClick={onclickHandler}
            />
        </div>
    );
});
