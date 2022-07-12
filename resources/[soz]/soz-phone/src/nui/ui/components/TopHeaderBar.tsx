import cn from 'classnames';
import React, { FunctionComponent, memo, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useCurrentCall } from '../../os/call/hooks/state';
import { useNotifications } from '../../os/notifications/hooks/useNotifications';
import usePhoneTime from '../../os/phone/hooks/usePhoneTime';
import { ThemeContext } from '../../styles/themeProvider';
import { BatteryIcon } from '../assets/battery';
import { CellIcon } from '../assets/cell';

export const TopHeaderBar: FunctionComponent = memo(() => {
    const { icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed } = useNotifications();

    const { pathname } = useLocation();
    const [currentCall] = useCurrentCall();
    const { theme } = useContext(ThemeContext);
    const time = usePhoneTime();

    useEffect(() => {
        if (notifications.length === 0) {
            setBarUncollapsed(false);
        }
    }, [notifications, setBarUncollapsed]);

    const color = () => {
        if (pathname === '/') {
            return 'text-white';
        } else if (pathname === '/call') {
            if (currentCall?.is_accepted) {
                return 'text-white bg-white bg-opacity-30';
            }
            return 'text-white';
        } else if (pathname.includes('/camera')) {
            return 'bg-black text-white';
        } else {
            return theme === 'dark' ? 'bg-black text-white' : 'bg-[#F2F2F6] text-black';
        }
    };

    return (
        <div
            className={cn('grid grid-cols-3 px-5 py-3 text-sm w-full z-40 cursor-pointer', color())}
            onClick={() => {
                setBarUncollapsed(curr => !curr);
            }}
        >
            <div className="flex justify-center font-semibold text-center truncate">
                <p className="mr-4">{time}</p>
                {icons.map(notifIcon => (
                    <div className="h-4 w-4 mx-1 notificationBarIcon">{notifIcon.icon}</div>
                ))}
            </div>

            <div>&nbsp;</div>

            <div className="flex justify-end">
                <span>ZT&T</span>
                <CellIcon className="w-5 h-5 mx-2" />
                <BatteryIcon className="w-5 h-5" />
            </div>
        </div>
    );
});
