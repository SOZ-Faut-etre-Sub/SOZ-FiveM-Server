import cn from 'classnames';
import { FunctionComponent, memo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useEmergency } from '../../../nui/hooks/useEmergency';
import { useConfig } from '../../hooks/usePhone';
import { useNotifications } from '../../os/notifications/hooks/useNotifications';

export const NavigationBar: FunctionComponent = memo(() => {
    const navigate = useNavigate();
    const emergency = useEmergency();
    const { pathname } = useLocation();
    const { setBarUncollapsed } = useNotifications();
    const config = useConfig();

    const color = useCallback(() => {
        if (pathname.includes('/camera') || pathname === '/' || pathname === '/call') {
            return 'bg-gray-200';
        } else {
            return config.theme.value === 'dark' ? 'bg-gray-200' : 'bg-ios-800';
        }
    }, [config.theme.value, pathname]);

    return (
        <div className="absolute flex bottom-0 left-0 right-0 w-full justify-center h-5 z-40">
            <div
                className={cn('bg-opacity-70 rounded w-2/4 h-[0.52rem]', emergency ? '' : 'cursor-pointer', color())}
                onClick={
                    emergency
                        ? () => {}
                        : () => {
                              navigate('/', { replace: true });
                              setBarUncollapsed(false);
                          }
                }
            />
        </div>
    );
});
