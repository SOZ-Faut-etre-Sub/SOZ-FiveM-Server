import cn from 'classnames';
import React, { FunctionComponent, memo, useContext, useEffect } from 'react';

import { useNotifications } from '../../os/notifications/hooks/useNotifications';
import usePhoneTime from '../../os/phone/hooks/usePhoneTime';
import { ThemeContext } from '../../styles/themeProvider';
import { BatteryIcon } from '../assets/battery';
import { CellIcon } from '../assets/cell';

export const TopHeaderBar: FunctionComponent = memo(() => {
    const { icons, notifications, setBarUncollapsed } = useNotifications();

    const { theme } = useContext(ThemeContext);
    const time = usePhoneTime();

    useEffect(() => {
        if (notifications.length === 0) {
            setBarUncollapsed(false);
        }
    }, [notifications, setBarUncollapsed]);

    const color = () => {
        return theme === 'dark' ? 'text-white' : 'text-black';
    };

    return (
        <div
            className={cn('z-40 grid grid-cols-3 px-5 py-3 text-sm w-full cursor-pointer', color())}
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
