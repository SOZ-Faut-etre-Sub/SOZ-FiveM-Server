import { Transition } from '@headlessui/react';
import Alert from '@ui/old_components/Alert';
import React from 'react';

import { useEmergency } from '../../../../nui/hooks/useEmergency';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationAlert = () => {
    const { currentAlert } = useNotifications();
    const emergency = useEmergency();

    // TODO: improve notification hook
    const isPosition = /vec2\((-?[\d.]+),(-?[\d.]+)\)/g.test(currentAlert?.content.toString());

    if (!currentAlert || emergency) {
        return null;
    }

    return (
        <Transition
            appear={true}
            show={!!currentAlert}
            className="absolute inset-x-0 mt-10 z-40"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
        >
            <Alert onClick={e => currentAlert?.onClickAlert(e)} icon={currentAlert?.notificationIcon || undefined}>
                {isPosition ? 'Destination' : currentAlert?.content}
            </Alert>
        </Transition>
    );
};
