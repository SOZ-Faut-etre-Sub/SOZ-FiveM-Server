import { useSoundProvider } from '@os/sound/hooks/useSoundProvider';
import { getSoundSettings } from '@os/sound/utils/getSoundSettings';
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { DEFAULT_ALERT_HIDE_TIME } from '../notifications.constants';

export interface INotification {
    app: string;
    id?: string;
    title: string;
    content?: React.ReactNode;
    icon?: JSX.Element;
    notificationIcon?: React.FC<any>;
    sound?: boolean;
    cantClose?: boolean;
    keepWhenPhoneClosed?: boolean;
    onClose?: (notification: INotification) => void;
    onClick?: (notification: INotification) => void;
}

type INotificationAlert = INotification & {
    onClickAlert(e?: any): void;
    onCloseAlert(e?: any): void;
    resolve(): void;
};

export interface INotificationIcon {
    key: string;
    icon: React.FC<any>;
    badge: number;
}

export const NotificationsContext = createContext<{
    barUncollapsed: boolean;
    setBarUncollapsed: (v: boolean | ((c: boolean) => boolean)) => void;
    notifications: INotification[];
    currentAlert: INotificationAlert;
    icons: INotificationIcon[];
    count: number;
    removeAlerts(): void;
    addNotification(value: INotification): void;
    removeNotification(idx: number): void;
    updateId(id: string, value: Partial<INotification>): void;
    removeId(id: string): void;
    hasNotification(id: string): INotification | null;
    countAppNotification(app: string): number;
    addNotificationAlert(n: INotification, cb?: (n: INotification) => void);
}>(null);

export function NotificationsProvider({ children }) {
    const isPhoneAvailable = useSelector((state: RootState) => state.phone.available);
    const emergency = useSelector((state: RootState) => state.emergency);

    const settings = useSelector((state: RootState) => state.phone.config);
    const [barUncollapsed, setBarUncollapsed] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);

    const { mount, play } = useSoundProvider();

    const alertTimeout = useRef<NodeJS.Timeout>();
    const [alerts, setAlerts] = useState<Array<[INotification, (n: INotification) => void, string | undefined]>>([]);
    const [currentAlert, setCurrentAlert] = useState<INotificationAlert>();

    const updateNotification = useCallback((idx: number, value: INotification) => {
        setNotifications(all => {
            const updated = [...all];
            updated.splice(idx, 1, value);
            return updated;
        });
    }, []);

    const removeNotification = idx => {
        setNotifications(all => {
            const updated = all;
            updated.splice(idx, 1);
            return [...updated];
        });
    };

    const addNotification = useCallback((value: INotification) => {
        setNotifications(all => [value, ...all]);
    }, []);

    /**
     * Checks if a notification exists for current app
     * and returns its index or -1 if not found.
     */
    const countAppNotification = useCallback(
        (appId: string): number => {
            return notifications.filter(n => n.app === appId).length;
        },
        [notifications]
    );

    /**
     * Checks if a notification exists by its `id`
     */
    const hasNotification = useCallback(
        (id: string): INotification | null => {
            return notifications.find(n => n.id === id) || null;
        },
        [notifications]
    );

    const _showAlert = useCallback(
        (n: INotification, cb: (n: INotification) => void, soundUrl: string) => {
            return new Promise<void>(res => {
                const resolve = () => {
                    cb?.(n);
                    res();
                };

                const onExit = cb => () => {
                    cb?.(n);
                    clearTimeout(alertTimeout.current);
                    resolve();
                };

                setCurrentAlert({
                    ...n,
                    resolve,
                    onClickAlert: onExit(n.onClick),
                    onCloseAlert: onExit(n.onClose),
                });

                if (isPhoneAvailable && n.sound && soundUrl && !emergency.emergency) {
                    play(soundUrl);
                }

                if (n.keepWhenPhoneClosed) {
                    return;
                }

                alertTimeout.current = setTimeout(() => {
                    resolve();
                    // If you change or remove the 300 i'll kill your pet - Kidz /s
                    // Really, this makes it work nicely with usePhoneVisibility :)
                }, DEFAULT_ALERT_HIDE_TIME + 300);
            });
        },
        [isPhoneAvailable, play, emergency]
    );

    const addNotificationAlert = (n: INotification, cb: (n: INotification) => void) => {
        if (alerts.find(a => a[0].id === n.id)) {
            return;
        }

        if (n.sound) {
            const { sound, volume } = getSoundSettings(
                n.app === 'society-messages' ? 'societyNotification' : 'notiSound',
                settings,
                n.app
            );
            mount(sound, volume, false).then(({ url }) => setAlerts(curr => [...curr, [n, cb, url]]));
            return;
        }
        setAlerts(curr => [...curr, [n, cb, undefined]]);
    };

    const removeId = (id: string) => {
        setNotifications(curr => curr.filter(n => n.id !== id));
    };

    const updateId = (id: string, value: Partial<INotification>) => {
        const idx = notifications.findIndex(n => n.id === id);
        if (idx !== -1) {
            const curr = { ...notifications[idx], ...value };
            updateNotification(idx, curr);
        }
    };

    useEffect(() => {
        if (!currentAlert && alerts.length) {
            _showAlert(...alerts[0]).then(() => {
                setAlerts(curr => {
                    const newQueue = curr;
                    curr.shift();
                    return newQueue;
                });
                setCurrentAlert(null);
            });
        }
    }, [_showAlert, alerts, currentAlert]);

    const icons: INotificationIcon[] = useMemo(
        () =>
            notifications.reduce((icons, curr) => {
                const find = icons.findIndex(i => i.key === curr.app);
                if (find !== -1) {
                    icons[find].badge++;
                    return icons;
                }
                icons.unshift({ key: curr.app, icon: curr.notificationIcon, badge: 1 });
                return icons;
            }, []),
        [notifications]
    );

    const removeAlerts = () => {
        setAlerts([]);
        setCurrentAlert(null);
    };

    return (
        <NotificationsContext.Provider
            value={{
                setBarUncollapsed,
                barUncollapsed,
                currentAlert,
                notifications,
                removeAlerts,
                addNotification,
                removeNotification,
                updateId,
                removeId,
                hasNotification,
                countAppNotification,
                addNotificationAlert,
                icons,
                count: notifications.length,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}
