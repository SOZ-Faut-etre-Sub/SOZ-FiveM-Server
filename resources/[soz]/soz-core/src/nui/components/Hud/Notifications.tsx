import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { uuidv4 } from '../../../core/utils';
import { AdvancedNotification, BasicNotification } from '../../../shared/notification';
import { useHud } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import { formatText } from '../../utils/gta-format';

type NotificationProps = {
    notification: BasicNotification | AdvancedNotification;
    onDelete: () => void;
};

const isAdvancedNotification = (
    notification: BasicNotification | AdvancedNotification
): notification is AdvancedNotification => {
    return (notification as AdvancedNotification).title !== undefined;
};

const Notification: FunctionComponent<NotificationProps> = ({ notification, onDelete }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpening, setIsOpening] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsOpening(false), 300);
    }, []);

    useEffect(() => {
        if (isClosing) {
            const timeoutId = setTimeout(onDelete, 300);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [isClosing, onDelete]);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsClosing(true), notification.delay + 300);

        return () => clearTimeout(timeoutId);
    }, []);

    const classes = classNames(
        'w-full relative px-3 py-2 overflow-hidden mb-2 transition-all rounded text-sm text-white bg-gradient-to-r from-black/60 to-black/25 border-l-4',
        {
            'border-red-500': notification.style === 'error',
            'border-green-500': notification.style === 'success',
            'border-blue-500': notification.style === 'info',
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
                    <div className="flex items-center">
                        <img
                            src={
                                notification.image.startsWith('http')
                                    ? notification.image
                                    : `https://nui-img/${notification.image}/${notification.image}`
                            }
                        />
                        <div className="flex flex-col overflow-hidden">
                            <p dangerouslySetInnerHTML={{ __html: formatText(notification.title) }} />
                            <p dangerouslySetInnerHTML={{ __html: formatText(notification.subtitle) }} />
                        </div>
                    </div>
                )}
                <p className="px-3 py-0" dangerouslySetInnerHTML={{ __html: formatText(notification.message) }} />
            </div>
        </Transition>
    );
};

export const Notifications: FunctionComponent = () => {
    const { minimap } = useHud();
    const [notifications, setNotifications] = useState<(BasicNotification | AdvancedNotification)[]>([]);

    const createNotification = useCallback(
        (notification: BasicNotification | AdvancedNotification) => {
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
        'notification',
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
        <div
            className="absolute flex flex-col-reverse"
            style={{
                top: `calc((100vh * ${minimap.top}) - calc((100vh * ${minimap.height}) * 4) - .5rem )`,
                left: `calc(100vw * ${minimap.left})`,
                height: `calc((100vh * ${minimap.height}) * 4)`,
                width: `calc(100vw * ${minimap.width})`,
            }}
        >
            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    notification={notification}
                    onDelete={() => deleteNotification(notification.id)}
                />
            ))}
        </div>
    );
};
