import { Transition } from '@headlessui/react';
import cn from 'classnames';
import React, { FunctionComponent, memo, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useTime } from '../../hooks/usePhone';
import { useCall } from '../../hooks/useSimCard';
import { NotificationItem } from '../../os/notifications/components/NotificationItem';
import { useNotifications } from '../../os/notifications/hooks/useNotifications';
import { ThemeContext } from '../../styles/themeProvider';
import { BatteryIcon } from '../assets/battery';
import { CellIcon } from '../assets/cell';

export const TopHeaderBar: FunctionComponent = memo(() => {
    const { icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed } = useNotifications();

    const { pathname } = useLocation();
    const currentCall = useCall();
    const { theme } = useContext(ThemeContext);
    const time = useTime();

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
            return theme === 'dark' ? 'bg-black text-white' : 'bg-ios-50 text-black';
        }
    };

    return (
        <>
            <div
                className={cn('z-40 grid grid-cols-3 px-5 py-3 text-sm w-full cursor-pointer', color())}
                onClick={() => {
                    setBarUncollapsed(curr => !curr);
                }}
            >
                <div className="flex justify-center font-semibold text-center truncate">
                    <p className="mr-4">{time}</p>
                    {icons.map(notifIcon => {
                        const Icon = notifIcon.icon;
                        return <Icon className={`text-white h-4 w-4 rounded-sm`} />;
                    })}
                </div>

                <div>&nbsp;</div>

                <div className="flex justify-end">
                    <span>ZT&T</span>
                    <CellIcon className="w-5 h-5 mx-2" />
                    <BatteryIcon className="w-5 h-5" />
                </div>
            </div>

            <Transition
                appear={true}
                show={barUncollapsed}
                className="absolute inset-0 h-full w-full z-40"
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-y-full"
                enterTo="translate-y-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-y-0"
                leaveTo="-translate-y-full"
            >
                <div className="h-full bg-black bg-opacity-60 backdrop-blur text-white flex flex-col items-center">
                    <div className="my-20 font-light text-6xl">{time}</div>
                    <ul className="divide-y divide-gray-600 w-4/5 overflow-y-scroll">
                        {notifications.map((notification, idx) => (
                            <NotificationItem
                                key={idx}
                                {...notification}
                                onClose={e => {
                                    e.stopPropagation();
                                    notification.onClose?.(notification);
                                    removeNotification(idx);
                                }}
                                onClickClose={() => {
                                    setBarUncollapsed(false);
                                    if (!notification.cantClose) {
                                        removeNotification(idx);
                                    }
                                }}
                            />
                        ))}
                    </ul>
                </div>
            </Transition>
        </>
    );
});
