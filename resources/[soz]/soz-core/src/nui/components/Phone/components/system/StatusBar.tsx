import { Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import React, { FunctionComponent, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { BatteryIcon } from '../../assets/battery';
import { CellIcon } from '../../assets/cell';
import { FlyIcon } from '../../assets/fly';
import { SatelliteIcon } from '../../assets/satellite';
import { useAppActions, useAppGetBack, useAppTitle } from '../../system/apps/apps.atom';
import { useApp } from '../../system/apps/hooks/useApp';
import { usePlaneMode, useThemeConfig } from '../../system/config/config.atom';
import { DynamicIsland } from '../../system/dynamic-island/components/DynamicIsland';
import { useEmergency } from '../../system/emergency/emergency.atom';
import { NotificationItem } from '../../system/notifications/components/NotificationItem';
import { useNotificationDrawer } from '../../system/notifications/hooks/useNotificationDrawer';
import { useNotifications } from '../../system/notifications/hooks/useNotifications';
import { usePhoneTime } from '../../system/phone.atom';
import { useCall } from '../../system/sim-card/hooks/useCall';
import { useCallModalOpen } from '../../system/sim-card/sim.card.atom';
import { Button } from '../Button';

export const StatusBar: FunctionComponent = memo(() => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { t } = useTranslation();
    const { icon: DialerIcon } = useApp('dialer');

    const { notifications, removeNotification } = useNotifications();
    const { drawerOpen, setDrawerOpen } = useNotificationDrawer();
    const { currentCall } = useCall();

    const themeConfig = useThemeConfig();
    const planeMode = usePlaneMode();
    const time = usePhoneTime();
    const callModal = useCallModalOpen();
    const emergency = useEmergency();
    const appTitle = useAppTitle();
    const appGetBack = useAppGetBack();
    const appActions = useAppActions();

    useEffect(() => {
        if (notifications.length === 0) {
            setDrawerOpen(false);
        }
    }, [notifications, setDrawerOpen]);

    const color = () => {
        if (['/', '/emergency', '/weather', '/game-tetris', '/snake', '/bank'].includes(pathname)) {
            return 'text-white';
        } else if (pathname === '/call' || (currentCall && pathname.includes('/phone'))) {
            return 'text-white';
        } else if (pathname.includes('/camera')) {
            return 'bg-black text-white';
        } else if (['/darkweb'].includes(pathname)) {
            return 'text-teal-500';
        } else {
            return themeConfig === 'dark' ? 'text-white' : 'text-black';
        }
    };

    const styles = useSpring({
        opacity: appTitle.display ? 1 : 0,
    });

    return (
        <>
            <div
                className={clsx(`flex-none h-[70px] flex justify-between items-center px-5 w-full`, color(), {
                    'cursor-pointer': !emergency,
                })}
                onClick={() => {
                    if (emergency) return;
                    setDrawerOpen(curr => !curr);
                }}
            >
                <div className="flex justify-start items-center gap-1 font-semibold truncate pl-4 w-2/6">
                    <p className="mr-2">{time}</p>
                    {!emergency && callModal && <DialerIcon className={`text-white h-4 w-4 rounded-sm`} />}
                    {/*{!emergency &&*/}
                    {/*    notifications.map(({ id, icon: Icon }) => (*/}
                    {/*        <Icon key={id} className={`text-white h-4 w-4 rounded-sm`} />*/}
                    {/*    ))}*/}
                </div>

                <DynamicIsland />

                <div className="flex justify-end items-center gap-1 font-semibold text-xs pr-4 w-2/6">
                    {planeMode ? <SatelliteIcon className="size-4" /> : <span>ZT&T</span>}
                    <CellIcon strength={planeMode ? -1 : 3} className="size-5" />
                    <BatteryIcon capacity={80} className="w-6 h-5" />
                </div>
            </div>

            <span
                className={clsx('flex justify-between gap-2 font-semibold px-5 pb-2', {
                    'text-gray-200': themeConfig === 'dark',
                    'text-black': themeConfig === 'light',
                })}
            >
                <Button
                    className="flex-none flex items-center text-[#347DD9] text-base w-1/4"
                    onClick={appGetBack.onClick}
                >
                    {appGetBack.display && (
                        <>
                            <ChevronLeftIcon className="size-4" /> {appGetBack.label}
                        </>
                    )}
                </Button>
                <animated.span style={styles} className="grow text-center">
                    {appTitle.title}
                </animated.span>
                <div className="flex-none flex justify-end items-center gap-1.5 w-1/4">
                    {appActions
                        .filter(action => action.display)
                        .map((action, idx) => (
                            <Button
                                key={idx}
                                className={clsx('flex items-center text-[#347DD9] text-base', action.className)}
                                onClick={action.onClick}
                            >
                                {action.icon}
                            </Button>
                        ))}
                </div>
            </span>

            <Transition
                appear={true}
                show={drawerOpen}
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
                    onClick={() => setDrawerOpen(false)}
                >
                    <div className="mt-24 mb-12 font-semibold text-8xl">{time}</div>

                    <ul className="flex flex-col-reverse gap-2 h-full w-full p-4 mb-6 overflow-y-scroll">
                        {notifications.map((notification, idx) => (
                            <NotificationItem
                                key={idx}
                                {...notification}
                                onClickClose={() => {
                                    setDrawerOpen(false);
                                    if (!notification.cantClose) {
                                        notification.onClose?.(notification);
                                        removeNotification(notification.id);
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
                                    currentCall &&
                                    t('DIALER.MESSAGES.CURRENT_CALL_WITH', {
                                        transmitter: currentCall.isTransmitter
                                            ? currentCall.receiver
                                            : currentCall.transmitter,
                                    })
                                }
                                onClick={() => {
                                    setDrawerOpen(false);
                                    navigate('/call');
                                }}
                            />
                        )}

                        {planeMode && (
                            <NotificationItem
                                app="settings"
                                notificationIcon={FlyIcon}
                                title={t('SETTINGS.OPTIONS.PLANE_MODE')}
                                content={t('SETTINGS.OPTIONS.PLANE_MODE_ACTIVATED')}
                                onClick={() => {
                                    setDrawerOpen(false);
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
