import { animated, useTransition } from '@react-spring/web';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import { useNotification } from '../hooks/useNotifications';
import { lastNotificationAtom } from '../notification.atom';
import { NotificationItem } from './NotificationItem';

export const NotificationAlert = () => {
    const lastNotification = useAtomValue(lastNotificationAtom);
    const message = useNotification(lastNotification);

    const [currentMessage, setCurrentMessage] = useState([]);
    const timer = useRef<NodeJS.Timeout>();

    const removeCurrentMessage = () => {
        setCurrentMessage([]);

        if (timer.current) {
            clearTimeout(timer.current);
        }
    };

    useEffect(() => {
        if (message) {
            setCurrentMessage([message]);
            timer.current = setTimeout(removeCurrentMessage, 3000);
        } else {
            removeCurrentMessage();
        }

        return () => removeCurrentMessage();
    }, [message]);

    const transitions = useTransition(currentMessage, {
        from: { top: -56 },
        keys: item => item?.id,
        enter: () => async next => {
            await next({ top: 56 });
        },
        leave: [{ top: -56 }],
        config: (_item, _index, phase) => key =>
            phase === 'enter' && key === 'life' ? { duration: 3000 } : { tension: 125, friction: 20, precision: 0.1 },
    });

    return transitions(({ top }, notification) => (
        <animated.div className="absolute inset-x-5 z-50" style={{ top }}>
            <NotificationItem {...notification} />
        </animated.div>
    ));
};
