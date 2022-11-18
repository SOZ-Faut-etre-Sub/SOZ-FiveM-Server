import { Transition } from '@headlessui/react';
import cn from 'classnames';
import React, { FunctionComponent, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCallModal, useConfig, useTime } from '../../hooks/usePhone';
import { useCall as useCurrentCall } from '../../hooks/useSimCard';
import { useApp } from '../../os/apps/hooks/useApps';
import { useCall } from '../../os/call/hooks/useCall';
import { NotificationItem } from '../../os/notifications/components/NotificationItem';
import { useNotifications } from '../../os/notifications/hooks/useNotifications';
import { BatteryIcon } from '../assets/battery';
import { CellIcon } from '../assets/cell';

export const TopHeaderBar: FunctionComponent = memo(() => {
    const [t] = useTranslation();
    const navigate = useNavigate();

    const { icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed } = useNotifications();

    const { pathname } = useLocation();
    const currentCall = useCurrentCall();
    const { call } = useCall();

    const callModal = useCallModal();
    const { icon: DialerIcon } = useApp('dialer');

    const config = useConfig();
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
            return config.theme.value === 'dark' ? 'bg-ios-800 text-white' : 'bg-ios-50 text-black';
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
                    {callModal && <DialerIcon className={`text-white h-4 w-4 mr-0.5 rounded-sm`} />}
                    {icons.map(notifIcon => {
                        const Icon = notifIcon.icon;
                        return <Icon className={`text-white h-4 w-4 mr-0.5 rounded-sm`} />;
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
                <div className="h-full bg-ios-800 bg-opacity-60 backdrop-blur text-white flex flex-col items-center">
                    <div className="my-20 font-light text-6xl">{time}</div>
                    <ul className="divide-y divide-gray-600 w-4/5 overflow-y-scroll">
                        {callModal && (
                            <NotificationItem
                                app="dialer"
                                title={t('DIALER.MESSAGES.CURRENT_CALL_TITLE')}
                                content={
                                    call &&
                                    t('DIALER.MESSAGES.CURRENT_CALL_WITH', {
                                        transmitter: call.isTransmitter ? call.receiver : call.transmitter,
                                    })
                                }
                                onClick={() => {
                                    navigate('/call');
                                }}
                                notificationIcon={() => <DialerIcon className="h-5 w-5 rounded-md" />}
                                onClose={() => {}}
                                onClickClose={() => {}}
                            />
                        )}
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
