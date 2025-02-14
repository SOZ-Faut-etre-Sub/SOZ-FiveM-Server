import { animated, useTransition } from '@react-spring/web';
import { useAtomValue } from 'jotai/index';
import React, { useEffect, useRef, useState } from 'react';

import { useNotification } from '../../notifications/hooks/useNotifications';
import { lastNotificationAtom } from '../../notifications/notification.atom';
import { useContact } from '../../sim-card/hooks/useContact';

export const NotificationDynamicIsland = () => {
    const lastNotification = useAtomValue(lastNotificationAtom);
    const message = useNotification(lastNotification);

    const timer = useRef<NodeJS.Timeout>();
    const [currentMessage, setCurrentMessage] = useState([]);
    const contact = useContact(currentMessage?.[0]?.title);

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
        from: {
            opacity: 0,
            height: 0,
            width: 0,
            left: 200,
        },
        keys: item => item?.id,
        enter: () => async next => {
            await next({
                opacity: 1,
                height: 96,
                width: 320,
                left: 60,
            });
        },
        leave: [
            {
                opacity: 0,
                height: 0,
                width: 0,
                left: 200,
            },
        ],
        config: (_item, _index, phase) => key =>
            phase === 'enter' && key === 'life' ? { duration: 3000 } : { tension: 125, friction: 20, precision: 0.1 },
    });

    return transitions((styles, { title, icon: Icon, content, onClick }) => (
        <animated.div
            className="absolute top-4 flex items-end py-3 px-4 bg-black rounded-3xl cursor-pointer z-50 overflow-hidden"
            style={styles}
            onClick={onClick}
        >
            <div className="flex justify-center items-center gap-3 grow min-w-0">
                {Icon && <Icon className="text-white size-12 p-1 rounded-xl shrink-0" />}

                <div className="flex flex-col grow truncate">
                    <div className="text-white text-sm truncate">{contact?.display || title}</div>
                    <div className="text-gray-400 text-xs">{content}</div>
                </div>
            </div>
        </animated.div>
    ));
};
