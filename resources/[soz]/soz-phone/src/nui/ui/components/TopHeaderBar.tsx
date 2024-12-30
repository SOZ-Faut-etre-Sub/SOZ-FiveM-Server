import { Transition } from '@headlessui/react';
import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import clsx from 'clsx';
import React, { FunctionComponent, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { useEmergency } from '../../hooks/useEmergency';
import { useCallModal, useConfig, useTime } from '../../hooks/usePhone';
import { useApp } from '../../os/apps/hooks/useApps';
import { useCall } from '../../os/call/hooks/useCall';
import { NotificationItem } from '../../os/notifications/components/NotificationItem';
import { useNotifications } from '../../os/notifications/hooks/useNotifications';
import { RootState } from '../../store';
import { BatteryIcon } from '../assets/battery';
import { CellIcon } from '../assets/cell';
import { FlyIcon } from '../assets/fly';
import { SatelliteIcon } from '../assets/satellite';

export const TopHeaderBar: FunctionComponent = memo(() => {
    const [t] = useTranslation();
    const navigate = useNavigate();

    const { icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed } = useNotifications();

    const { pathname } = useLocation();
    const { call } = useCall();

    const callModal = useCallModal();
    const emergency = useEmergency();
    const { icon: DialerIcon } = useApp('dialer');

    const appDisplayTitle = useSelector((state: RootState) => state.appCommon.displayTitle);
    const appTitle = useSelector((state: RootState) => state.appCommon.title);
    const config = useConfig();
    const time = useTime();

    useEffect(() => {
        if (notifications.length === 0) {
            setBarUncollapsed(false);
        }
    }, [notifications, setBarUncollapsed]);

    const color = () => {
        if (['/', '/emergency', '/weather', '/game-tetris', '/snake', '/bank'].includes(pathname)) {
            return 'text-white';
        } else if (pathname === '/call' || (call && pathname.includes('/phone'))) {
            return 'text-white';
        } else if (pathname.includes('/camera')) {
            return 'bg-black text-white';
        } else if (['/darkweb'].includes(pathname)) {
            return 'text-teal-500';
        } else {
            return config.theme.value === 'dark' ? 'text-white' : 'text-black';
        }
    };

    const styles = useSpring({
        opacity: appDisplayTitle ? 1 : 0,
    });

    return (
        <>
            <div
                className={cn(`flex-none h-[70px] flex justify-between items-center px-5 w-full`, color(), {
                    'cursor-pointer': !emergency,
                })}
                onClick={() => {
                    if (emergency) return;
                    setBarUncollapsed(curr => !curr);
                }}
            >
                <div className="flex justify-start items-center gap-1 font-semibold truncate pl-4 w-2/6">
                    <p className="mr-2">{time}</p>
                    {!emergency && callModal && <DialerIcon className={`text-white h-4 w-4 rounded-sm`} />}
                    {!emergency &&
                        icons.map(notifIcon => {
                            const Icon = notifIcon.icon;
                            return <Icon key={notifIcon.key} className={`text-white h-4 w-4 rounded-sm`} />;
                        })}
                </div>

                <div className="flex justify-end items-center gap-1 font-semibold pr-4 w-2/6">
                    {config.planeMode ? (
                        <SatelliteIcon className="size-4" />
                    ) : (
                        <>
                            <span>ZT&T</span>
                            <CellIcon strength={3} className="w-5 h-5" />
                        </>
                    )}

                    <BatteryIcon capacity={80} className="w-6 h-5" />
                </div>
            </div>

            <animated.span
                style={styles}
                className={clsx('flex justify-center font-semibold pb-2', {
                    'text-gray-200': config.theme.value === 'dark',
                    'text-black': config.theme.value === 'light',
                })}
            >
                {appTitle}
            </animated.span>

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
                <div
                    className="h-full bg-ios-800 bg-opacity-90 text-white flex flex-col items-center"
                    onClick={() => setBarUncollapsed(false)}
                >
                    <div className="mt-24 mb-12 font-semibold text-8xl">{time}</div>

                    <ul className="flex flex-col-reverse gap-2 h-full w-full p-4 mb-6 overflow-y-scroll">
                        {notifications.map((notification, idx) => (
                            <NotificationItem
                                key={idx}
                                {...notification}
                                onClickClose={() => {
                                    setBarUncollapsed(false);
                                    if (!notification.cantClose) {
                                        notification.onClose?.(notification);
                                        removeNotification(idx);
                                    }
                                }}
                            />
                        ))}

                        {callModal && (
                            <NotificationItem
                                app="dialer"
                                notificationIcon={DialerIcon}
                                title={t('DIALER.MESSAGES.CURRENT_CALL_TITLE')}
                                content={
                                    call &&
                                    t('DIALER.MESSAGES.CURRENT_CALL_WITH', {
                                        transmitter: call.isTransmitter ? call.receiver : call.transmitter,
                                    })
                                }
                                onClick={() => {
                                    setBarUncollapsed(false);
                                    navigate('/call');
                                }}
                            />
                        )}

                        {config.planeMode && (
                            <NotificationItem
                                app="settings"
                                notificationIcon={FlyIcon}
                                title={t('SETTINGS.OPTIONS.PLANE_MODE')}
                                content={t('SETTINGS.OPTIONS.PLANE_MODE_ACTIVATED')}
                                onClick={() => {
                                    setBarUncollapsed(false);
                                    navigate('/settings');
                                }}
                            />
                        )}
                    </ul>
                </div>
            </Transition>
        </>
    );
});
