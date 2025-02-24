import { ChevronLeftIcon, XIcon } from '@heroicons/react/solid';
import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import React, { FunctionComponent, memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosFlashlight } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';

import { BatteryIcon } from '../../assets/battery';
import CameraIcon from '../../assets/camera.svg';
import { CellIcon } from '../../assets/cell';
import { FlyIcon } from '../../assets/fly';
import { SatelliteIcon } from '../../assets/satellite';
import { useAppActions, useAppGetBack, useAppTitle } from '../../system/apps/apps.atom';
import { usePlaneMode, useThemeConfig } from '../../system/config/config.atom';
import { DynamicIsland } from '../../system/dynamic-island/components/DynamicIsland';
import { useEmergency } from '../../system/emergency/emergency.atom';
import { NotificationItem } from '../../system/notifications/components/NotificationItem';
import { useNotificationDrawer } from '../../system/notifications/hooks/useNotificationDrawer';
import { useNotifications } from '../../system/notifications/hooks/useNotifications';
import { usePhoneTime } from '../../system/phone.atom';
import { flashLightAtomWithNui } from '../../system/phone.utils.atom';
import { useCall } from '../../system/sim-card/hooks/useCall';
import { Button } from '../Button';

interface StatusBarProps {
    forceControlColor?: 'light' | 'dark';
}

export const StatusBar: FunctionComponent<StatusBarProps> = memo(({ forceControlColor }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { t } = useTranslation();

    const [flashLight, setFlashLight] = useAtom(flashLightAtomWithNui);
    const { notifications, removeNotification, cleanNotifications } = useNotifications();
    const { drawerOpen, setDrawerOpen } = useNotificationDrawer();
    const { currentCall } = useCall();

    const themeConfig = useThemeConfig();
    const planeMode = usePlaneMode();
    const time = usePhoneTime();
    const emergency = useEmergency();
    const appTitle = useAppTitle();
    const appGetBack = useAppGetBack();
    const appActions = useAppActions();

    useEffect(() => {
        if (notifications.length === 0) {
            setDrawerOpen(false);
        }
    }, [notifications, setDrawerOpen]);

    const color = useMemo(() => {
        const lightMode = 'text-white';
        const darkMode = 'text-black';

        if (forceControlColor) {
            return forceControlColor === 'light' ? lightMode : darkMode;
        }

        if (['/', '/emergency', '/weather', '/snake', '/bank'].includes(pathname)) {
            return lightMode;
        } else if (pathname.includes('/camera')) {
            return 'bg-black text-white';
        } else if (['/darkweb'].includes(pathname)) {
            return 'text-teal-500';
        } else {
            return themeConfig === 'dark' ? lightMode : darkMode;
        }
    }, [currentCall, pathname, themeConfig, forceControlColor]);

    const titleStyles = useSpring({
        opacity: appTitle.display ? 1 : 0,
    });

    const drawerStyles = useSpring({
        opacity: drawerOpen ? 1 : 0,
        translateY: drawerOpen ? `0vh` : `-100vh`,
    });

    return (
        <>
            <div
                className={clsx(`flex-none h-[70px] flex justify-between items-center px-5 w-full`, color, {
                    'cursor-pointer': !emergency,
                })}
                onClick={() => {
                    if (emergency) return;
                    setDrawerOpen(curr => !curr);
                }}
            >
                <div className="flex justify-start items-center gap-1 font-semibold truncate pl-4 w-2/6">
                    <p className="mr-2">{time}</p>
                    {!emergency &&
                        notifications
                            .filter(n => n.icon !== undefined)
                            .map(({ id, icon: Icon }) => <Icon key={id} className="text-white size-4 rounded-sm" />)}
                </div>

                <DynamicIsland />

                <div className="flex justify-end items-center gap-1 font-semibold text-xs pr-4 w-2/6">
                    {planeMode ? <SatelliteIcon className="size-4" /> : <span>ZT&T</span>}
                    <CellIcon strength={planeMode ? -1 : 3} className="size-5" />
                    <BatteryIcon capacity={80} className="w-6 h-5" />
                </div>
            </div>

            <span
                className={clsx('flex justify-between gap-2 font-semibold px-5 pb-2', color, {
                    'text-gray-200': themeConfig === 'dark',
                    'text-black': themeConfig === 'light',
                })}
            >
                <Button
                    className={clsx(
                        'flex-none flex items-center text-[#347DD9] text-base w-1/4 focus:outline-none',
                        appGetBack.className,
                        {
                            'cursor-default': !appGetBack.display,
                        }
                    )}
                    onClick={appGetBack.onClick}
                >
                    {appGetBack.display && (
                        <>
                            <ChevronLeftIcon className="size-4" /> {appGetBack.label}
                        </>
                    )}
                </Button>
                <animated.span style={titleStyles} className="grow text-center truncate">
                    <p className="truncate">{appTitle.title}</p>
                    {appTitle.subtitle && <p className="truncate text-gray-500 text-xs">{appTitle.subtitle}</p>}
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

            <animated.div style={drawerStyles} className="absolute inset-0 h-full w-full z-40">
                <div
                    className="flex flex-col items-center h-full bg-ios-800 bg-opacity-90 text-white pb-12"
                    onClick={() => setDrawerOpen(false)}
                >
                    <div className="mt-24 mb-12 font-semibold text-8xl">{time}</div>

                    <ul className="flex grow flex-col-reverse gap-2 p-4 w-full overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                        {notifications.map((notification, idx) => (
                            <NotificationItem
                                key={idx}
                                {...notification}
                                onClick={() => {
                                    if (!notification.cantClose) {
                                        notification.onClick?.(notification);
                                        notification.onClose?.(notification);
                                        removeNotification(notification.id);
                                    }
                                    setDrawerOpen(false);
                                }}
                            />
                        ))}

                        {planeMode && (
                            <NotificationItem
                                id="plane-mode"
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

                        {notifications.length > 0 && (
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl">Centre de Notification</h2>

                                <button
                                    className="flex justify-center items-center size-7 rounded-full bg-ios-700/80 text-white/50"
                                    onClick={cleanNotifications}
                                >
                                    <XIcon className="size-4" />
                                </button>
                            </div>
                        )}
                    </ul>

                    <div className="flex justify-between items-center gap-2 px-6 w-full">
                        <button
                            className={clsx('flex justify-center items-center size-12 rounded-full ', {
                                'bg-ios-700/80': !flashLight,
                                'bg-ios-200/80': flashLight,
                            })}
                            onClick={() => setFlashLight(!flashLight)}
                        >
                            <IoIosFlashlight className="size-6" />
                        </button>

                        <button
                            className="flex justify-center items-center size-12 rounded-full bg-ios-700/80"
                            onClick={() => navigate('/camera')}
                        >
                            <CameraIcon className="size-6" />
                        </button>
                    </div>
                </div>
            </animated.div>
        </>
    );
});
