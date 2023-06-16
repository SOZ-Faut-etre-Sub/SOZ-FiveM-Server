import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { uuidv4 } from '../../../core/utils';
import { AdvancedNotification, BasicNotification, TPoliceNotification } from '../../../shared/notification';
import { useHud } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import { formatText } from '../../utils/gta-format';

type NotificationProps = {
    notification: BasicNotification | AdvancedNotification;
    onDelete: () => void;
};

type PoliceNotificationProps = {
    notification: TPoliceNotification;
    onDelete: () => void;
};

const isAdvancedNotification = (
    notification: BasicNotification | AdvancedNotification | TPoliceNotification
): notification is AdvancedNotification => {
    return (notification as AdvancedNotification).image !== undefined;
};

const isPoliceNotification = (
    notification: BasicNotification | AdvancedNotification | TPoliceNotification
): notification is TPoliceNotification => {
    return (notification as TPoliceNotification).policeStyle !== undefined;
};

const Notification: FunctionComponent<NotificationProps> = ({ notification, onDelete }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpening, setIsOpening] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsOpening(false), 300);
    }, []);

    useEffect(() => {
        let timeoutId = null;

        if (isClosing) {
            timeoutId = setTimeout(() => {
                onDelete();
                timeoutId = null;
            }, 300);
        }

        return () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
    }, [isClosing, onDelete]);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsClosing(true), notification.delay + 300);

        return () => clearTimeout(timeoutId);
    }, []);

    const classes = classNames(
        'w-full relative px-2 py-3 overflow-hidden mb-2 transition-all rounded text-sm lg:text-lg text-white bg-gradient-to-r from-black/60 to-black/25 border-l-4',
        {
            'border-red-500': notification.style === 'error',
            'border-green-500': notification.style === 'success',
            'border-blue-500':
                notification.style !== 'error' && notification.style !== 'success' && notification.style !== 'warning',
            'border-orange-500': notification.style === 'warning',
        }
    );

    return (
        <Transition
            show={!isClosing && !isOpening}
            enter="transform ease-out duration-300 transition"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transform ease-in duration-300 transition"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
        >
            <div className={classes}>
                {isAdvancedNotification(notification) && (
                    <div className="flex items-center mb-2">
                        <img
                            src={
                                notification.image.startsWith('http')
                                    ? notification.image
                                    : `https://nui-img/${notification.image}/${notification.image}`
                            }
                            alt={notification.image}
                        />
                        <div className="ml-4 flex flex-col overflow-hidden">
                            <p dangerouslySetInnerHTML={{ __html: formatText(notification.title) }} />
                            <p dangerouslySetInnerHTML={{ __html: formatText(notification.subtitle) }} />
                        </div>
                    </div>
                )}
                <p dangerouslySetInnerHTML={{ __html: formatText(notification.message) }} />
            </div>
        </Transition>
    );
};

const PoliceNotification: FunctionComponent<PoliceNotificationProps> = ({ notification, onDelete }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpening, setIsOpening] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsOpening(false), 300);
    }, []);

    useEffect(() => {
        let timeoutId = null;

        if (isClosing) {
            timeoutId = setTimeout(() => {
                onDelete();
                timeoutId = null;
            }, 300);
        }

        return () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
    }, [isClosing, onDelete]);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsClosing(true), notification.delay + 300);

        return () => clearTimeout(timeoutId);
    }, []);

    const image = (): string => {
        if (isPoliceNotification(notification)) {
            switch (notification.logo) {
                case 'bcso':
                    return 'https://soz.zerator.com/static/images/bcso.png';
                case 'fib':
                    return 'https://soz.zerator.com/static/images/fbi.png';
                case 'lspd':
                default:
                    return 'https://soz.zerator.com/static/images/lspd.png';
            }
        }
        return '';
    };

    const title = (): string => {
        if (notification.title !== null) {
            let titleType = '';
            switch (notification.policeStyle) {
                case 'robbery':
                    titleType = 'braquage';
                    break;
                case 'vandalism':
                    titleType = 'vandalisme';
                    break;
                case 'racket':
                    titleType = 'racket';
                    break;
                case 'shooting':
                    titleType = 'coup de feu';
                    break;
                case 'explosion':
                    titleType = 'explosion';
                    break;
                case 'auto-theft':
                    titleType = 'vol de voiture';
                    break;
                case 'default':
                default:
                    titleType = "à l'aide";
                    break;
            }
            return `Alerte : ~h~${titleType}~h~`;
        }
        return '';
    };

    const classColor = (): string => {
        switch (notification.policeStyle) {
            case 'robbery':
                return 'border-red-500';
            case 'vandalism':
                return 'border-yellow-300';
            case 'racket':
                return 'border-orange-500';
            case 'shooting':
                return 'border-indigo-500';
            case 'auto-theft':
                return 'border-cyan-500';
            case 'explosion':
                return 'border-pink-500';
            case 'default':
            default:
                return 'border-green-500';
        }
    };

    const classes = (): string => {
        return `w-full relative px-2 py-3 overflow-hidden mb-2 transition-all rounded text-sm lg:text-lg text-white bg-gradient-to-r from-black/60 to-black/25 border-l-4 ${classColor()}`;
    };

    const hours = (): string => {
        const currentDate = new Date();

        const messageHours = `0${currentDate.getHours()}`.slice(-2);
        const messageMinutes = `0${currentDate.getMinutes()}`.slice(-2);
        return `${messageHours}:${messageMinutes}`;
    };

    return (
        <Transition
            show={!isClosing && !isOpening}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-x-full"
            enterTo="-translate-x-0"
            leave="transform ease-in duration-300 transition"
            leaveFrom="-translate-x-0"
            leaveTo="translate-x-full"
        >
            <div className={classes()}>
                <div className="flex items-center mb-2 justify-between">
                    <img className="w-5" src={image()} alt={image()} />
                    <p className="uppercase" dangerouslySetInnerHTML={{ __html: formatText(title()) }} />
                    <p dangerouslySetInnerHTML={{ __html: hours() }} />
                </div>
                <p dangerouslySetInnerHTML={{ __html: formatText(notification.message) }} />
            </div>
        </Transition>
    );
};

export const Notifications: FunctionComponent = () => {
    const { minimap } = useHud();
    const [notifications, setNotifications] = useState<
        (BasicNotification | AdvancedNotification | TPoliceNotification)[]
    >([]);

    const createNotification = useCallback(
        (notification: BasicNotification | AdvancedNotification | TPoliceNotification) => {
            setNotifications(n => [notification, ...n]);
        },
        [setNotifications]
    );

    const deleteNotification = useCallback(
        (id: string) => {
            setNotifications(s => s.filter(n => n.id !== id));
        },
        [setNotifications]
    );

    useNuiEvent(
        'hud',
        'DrawNotification',
        notification => {
            createNotification({
                id: uuidv4(),
                ...notification,
            });
        },
        [createNotification]
    );

    return (
        <div>
            <div
                className="absolute flex flex-col-reverse"
                style={{
                    top: `calc((100vh * ${minimap.top}) - calc((100vh * ${minimap.height}) * 4) - .5rem )`,
                    left: `calc(100vw * ${minimap.left + 0.004})`,
                    height: `calc((100vh * ${minimap.height}) * 4)`,
                    width: `calc(100vw * ${minimap.width})`,
                }}
            >
                {notifications.map(
                    notification =>
                        !isPoliceNotification(notification) && (
                            <Notification
                                key={notification.id}
                                notification={notification}
                                onDelete={() => deleteNotification(notification.id)}
                            />
                        )
                )}
            </div>
            <div
                className="absolute flex flex-col-reverse"
                style={{
                    top: `calc(0.5rem)`,
                    right: `0`,
                    height: `35vh`,
                    width: `calc(100vw * ${minimap.width})`,
                }}
            >
                {notifications.map(
                    notification =>
                        isPoliceNotification(notification) && (
                            <PoliceNotification
                                key={notification.id}
                                notification={notification}
                                onDelete={() => deleteNotification(notification.id)}
                            />
                        )
                )}
            </div>
        </div>
    );
};
