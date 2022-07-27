import { Transition } from '@headlessui/react';
import Alert from '@ui/old_components/Alert';
import React, { useEffect } from 'react';

import { useSnackbar } from '../hooks/useSnackbar';

export const PhoneSnackbar: React.FC = () => {
    const { alert, isOpen, handleClose } = useSnackbar();

    useEffect(() => {
        const timer = setInterval(() => {
            handleClose();
        }, 3000);

        return () => clearInterval(timer);
    });

    if (!alert) {
        return null;
    }

    return (
        <Transition
            appear={true}
            show={isOpen}
            className="absolute inset-x-0 mt-10 z-40"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
        >
            <Alert severity={alert?.type || 'info'} onClose={handleClose}>
                {alert.message}
            </Alert>
        </Transition>
    );
};
