import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import cn from 'classnames';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';

import { uuidv4 } from '../../../core/utils';
import { AdvancedNotification, BasicNotification, TPoliceNotification } from '../../../shared/notification';
import { useNuiEvent } from '../../hook/nui';
import { RootState } from '../../store';
import { formatText } from '../../utils/gta-format';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

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

    useNuiEvent(
        'hud',
        'CancelNotification',
        id => {
            if (id === notification.id) {
                setIsClosing(true);
            }
        },
        [setIsClosing]
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
            className="relative"
        >
            <div className="w-full overflow-hidden transition-all rounded text-sm lg:text-lg text-white">
                <GlassMorphismContainer
                    className="p-3"
                    borderColor={classNames({
                        '#ef4444': notification.style === 'error',
                        '#22c55e': notification.style === 'success',
                        '#f97316': notification.style === 'warning',
                        '#3b82f6':
                            notification.style !== 'error' &&
                            notification.style !== 'success' &&
                            notification.style !== 'warning',
                    })}
                    borderClassName="rounded-xl"
                >
                    {isAdvancedNotification(notification) && (
                        <div className="flex items-center mb-2">
                            <img
                                className="w-16"
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
                </GlassMorphismContainer>
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

    const title = (): string => {
        if (notification.title !== null) {
            let titleType = '';
            switch (notification.policeStyle) {
                case 'red-alert':
                    titleType = 'code rouge';
                    break;
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
                case 'drug':
                    titleType = 'Stupéfiant';
                    break;
                case 'default':
                default:
                    titleType = 'message';
                    break;
            }
            return titleType;
        }
        return '';
    };

    const borderColor = useMemo((): string => {
        switch (notification.policeStyle) {
            case 'red-alert':
                return colors.red['500'];
            case 'robbery':
                return colors.lime['500'];
            case 'vandalism':
                return colors.yellow['400'];
            case 'racket':
                return colors.orange['500'];
            case 'shooting':
                return colors.indigo['500'];
            case 'auto-theft':
                return colors.cyan['500'];
            case 'drug':
                return colors.teal['300'];
            case 'explosion':
                return colors.pink['500'];
            case 'default':
            default:
                return colors.green['500'];
        }
    }, [notification.policeStyle]);

    const textColor = (): string => {
        switch (notification.policeStyle) {
            case 'red-alert':
                return 'text-red-500';
            case 'robbery':
                return 'text-lime-500';
            case 'vandalism':
                return 'text-yellow-400';
            case 'racket':
                return 'text-orange-500';
            case 'shooting':
                return 'text-indigo-500';
            case 'auto-theft':
                return 'text-cyan-500';
            case 'drug':
                return 'text-teal-300';
            case 'explosion':
                return 'text-pink-500';
            case 'default':
            default:
                return 'text-green-500';
        }
    };

    const hours = (): string => {
        const currentDate = new Date();

        const messageHours = `0${currentDate.getHours()}`.slice(-2);
        const messageMinutes = `0${currentDate.getMinutes()}`.slice(-2);
        return `${messageHours}:${messageMinutes}`;
    };

    const message = () => {
        return notification.message.replace(/{class}/g, `class="uppercase ${textColor()}"`);
    };

    const image = (): string => {
        let image = '/public/images/hud/notification/fdo.webp';

        if (notification.logo === 'lspd') {
            image = '/public/images/hud/notification/lspd.webp';
        }

        if (notification.logo === 'bcso') {
            image = '/public/images/hud/notification/bcso.webp';
        }

        if (notification.logo === 'sasp') {
            image = '/public/images/hud/notification/sasp.webp';
        }
        return image;
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
            <div
                className={cn(
                    'w-full relative overflow-hidden mb-2 transition-all rounded text-sm lg:text-lg text-white'
                )}
            >
                <GlassMorphismContainer
                    className="flex flex-col gap-2 py-2 px-4"
                    borderColor={borderColor}
                    borderClassName="rounded-xl"
                >
                    <div className="flex gap-2">
                        <img className="w-6" src={image()} alt="Blason des forces de l'ordre" />
                        <p className="flex items-center uppercase text-base lg:text-xl">
                            <span>Alerte :&nbsp;</span>
                            <span className="font-semibold" dangerouslySetInnerHTML={{ __html: formatText(title()) }} />
                        </p>
                    </div>

                    <p dangerouslySetInnerHTML={{ __html: formatText(message()) }} />

                    <div className="flex justify-between">
                        <span>{hours()}</span>
                        <span className="ml-4 normal-case text-sm">#{notification.notificationId}</span>
                    </div>
                </GlassMorphismContainer>
            </div>
        </Transition>
    );
};

export const Notifications: FunctionComponent = () => {
    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const minimap = useSelector((state: RootState) => state.hud.minimap);
    const settings = useSelector((state: RootState) => state.hud.settings);
    const showDateTime = useSelector((state: RootState) => state.hud.settings.showDateTime);
    const showWeather = useSelector((state: RootState) => state.hud.settings.showWeather);
    const showStreetName = useSelector((state: RootState) => state.hud.settings.showStreetName);

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

    const notificationOffset = () => {
        if (hasWatch && (showDateTime || showWeather)) {
            return 5 * settings.zoom + 'rem';
        }
        if (hasWatch && !showStreetName && minimap.isHidden) {
            return 7 * settings.zoom + 'rem';
        }
        return '.5rem';
    };

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
        <>
            <div
                className="absolute flex flex-col-reverse gap-4"
                style={{
                    top: `calc((100vh * ${minimap.top}) - calc((100vh * ${minimap.height}) * 4) - ${notificationOffset()})`,
                    left: `calc(100vw * ${minimap.left + 0.004})`,
                    height: `calc((100vh * ${minimap.height}) * 4)`,
                    width: `calc(100vw * ${minimap.width})`,
                    zIndex: 20,
                    pointerEvents: `none`,
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
                className="absolute flex flex-col-reverse gap-4"
                style={{
                    top: `calc(0.5rem)`,
                    right: `1rem`,
                    height: `50vh`,
                    width: `calc(100vw * ${minimap.width * 1.5})`,
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
        </>
    );
};
