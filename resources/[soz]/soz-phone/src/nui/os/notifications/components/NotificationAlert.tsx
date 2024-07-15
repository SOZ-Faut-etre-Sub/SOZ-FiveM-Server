import { Transition } from '@headlessui/react';
import Alert from '@ui/old_components/Alert';
import React from 'react';

import { useEmergency } from '../../../../nui/hooks/useEmergency';
import { useNotifications } from '../hooks/useNotifications';
import { MessageEvents } from '@typings/messages';
import { fetchNui } from '@utils/fetchNui';

const getAddress = async (input: string) => {
    const position = /vec3\((-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+)\)/g.exec(input);
    const street_name = await fetchNui(MessageEvents.GET_STREET_NAME, {
        x: position[1],
        y: position[2],
        z: position[3],
    });
    return street_name.data;
};

export const NotificationAlert = () => {
    const { currentAlert } = useNotifications();
    const emergency = useEmergency();
    const [address, setAddress] = React.useState('');
    // TODO: improve notification hook
    const isOldPosition = /vec2\((-?[\d.]+),(-?[\d.]+)\)/g.test(currentAlert?.content.toString());
    const isPosition = /vec3\((-?[\d.]+),(-?[\d.]+),(-?[\d.]+)\)/g.test(currentAlert?.content.toString());
    React.useEffect(() => {
        const getAddressAsync = async () => {
            try {
                const address = await getAddress(currentAlert?.content.toString());
                setAddress(address);
            } catch (error) {
                console.error(error);
                setAddress('Destination');
            }
        };
        if (isPosition) {
            getAddressAsync();
        }
    }, [currentAlert?.content.toString()]);

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
            <Alert onClick={(e) => currentAlert?.onClickAlert(e)} icon={currentAlert?.notificationIcon || undefined}>
                {isPosition ? address : isOldPosition ? 'Destination' : currentAlert?.content}
            </Alert>
        </Transition>
    );
};
