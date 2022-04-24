import React, {useContext, useEffect} from 'react';
import {useNotifications} from '../hooks/useNotifications';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import BatteryIcon from "../../../styles/icons/system/Battery";
import CellSignal from "../../../styles/icons/system/CellSignal";
import {useRouteMatch} from "react-router-dom";
import {ThemeContext} from "../../../styles/themeProvider";
import {NotificationItem} from "@os/notifications/components/NotificationItem";
import { Transition } from '@headlessui/react';
import {useCurrentCall} from "@os/call/hooks/state";
import cn from 'classnames';

export const NotificationBar = () => {
    const {icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed} = useNotifications();

    const home = useRouteMatch('/');
    const camera = useRouteMatch('/camera');
    const call = useRouteMatch('/call');
    const [currentCall,] = useCurrentCall();
    const {theme} = useContext(ThemeContext);
    const time = usePhoneTime();

    useEffect(() => {
        if (notifications.length === 0) {
            setBarUncollapsed(false);
        }
    }, [notifications, setBarUncollapsed]);

    const color = () => {
        if (home && home.isExact) {
            return 'text-white'
        } else if (call && call.isExact) {
            if (currentCall?.is_accepted) {
                return 'text-white bg-white bg-opacity-30'
            }
            return 'text-white'
        } else if (camera && camera.isExact) {
            return 'bg-black text-white'
        } else {
            return theme === 'dark' ? 'bg-black text-white' : 'bg-[#F2F2F6] text-black'
        }
    }

    return (
        <>
            <div className={cn('grid grid-cols-3 px-5 py-3 text-sm w-full z-50 cursor-pointer', color())} onClick={() => {
                setBarUncollapsed((curr) => !curr);
            }}>
                <div className="flex justify-center text-center truncate">
                    <p className="mr-2">{time}</p>
                    {icons.map((notifIcon) => (
                        <div className="h-4 w-4 mx-1 notificationBarIcon">
                            {notifIcon.icon}
                        </div>
                    ))}
                </div>
                <div>&nbsp;</div>
                <div className="flex justify-end">
                    <span>ZT&T</span>
                    <CellSignal className="h-5 w-5 mx-2"/>
                    <BatteryIcon className="h-5 w-5"/>
                </div>
            </div>

            <Transition
                appear={true}
                show={barUncollapsed}
                className="absolute inset-x-0 h-full w-full z-50"
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-y-full"
                enterTo="translate-y-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-y-0"
                leaveTo="-translate-y-full"
            >
                <div className="h-full bg-black bg-opacity-60 backdrop-blur text-white flex flex-col items-center">
                    <div className="my-20 font-light text-6xl">
                        {time}
                    </div>
                    <ul className="divide-y divide-gray-600 overflow-y-scroll">
                        {notifications.map((notification, idx) => (
                            <NotificationItem
                                key={idx}
                                {...notification}
                                onClose={(e) => {
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
};
