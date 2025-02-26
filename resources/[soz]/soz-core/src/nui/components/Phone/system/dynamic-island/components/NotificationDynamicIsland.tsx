import { useTransition } from '@react-spring/web';
import { useAtomValue } from 'jotai/index';
import React, { useEffect, useRef, useState } from 'react';

import { ContactPicture } from '../../../components/ContactPicture';
import { useNotification } from '../../notifications/hooks/useNotifications';
import { lastNotificationAtom } from '../../notifications/notification.atom';
import { usePhoneAvailable } from '../../phone.atom';
import { useContact } from '../../sim-card/hooks/useContact';
import { DynamicIslandContainer } from './DynamicIslandContainer';

export const NotificationDynamicIsland = () => {
    const available = usePhoneAvailable();

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
    }, [available, message]);

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
                width: 400,
                left: 20,
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
        <DynamicIslandContainer style={styles} onClick={onClick}>
            <div className="flex justify-center items-center gap-5 grow min-w-0 h-full">
                {contact ? (
                    <div className="relative shrink-0">
                        <ContactPicture size="medium" picture={contact?.avatar} />
                        {Icon && <Icon className="absolute -right-2 bottom-0 text-white size-8 rounded-md" />}
                    </div>
                ) : (
                    Icon && <Icon className="text-white size-12 p-1 rounded-xl shrink-0" />
                )}

                <div className="flex flex-col justify-center grow py-1 h-16">
                    <div className="text-white text-base line-clamp-1">{contact?.display || title}</div>
                    <div className="text-gray-400 text-sm line-clamp-2">{content}</div>
                </div>
            </div>
        </DynamicIslandContainer>
    ));
};
