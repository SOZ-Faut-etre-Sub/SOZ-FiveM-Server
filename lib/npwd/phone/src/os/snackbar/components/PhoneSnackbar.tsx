import React, {useEffect} from 'react';
import {useSnackbar} from '../hooks/useSnackbar';
import Alert from '@ui/components/Alert';
import { Transition } from '@headlessui/react';


export const PhoneSnackbar: React.FC = () => {
    const {alert, isOpen, handleClose} = useSnackbar();

    useEffect(() => {
        const timer = setInterval(() => {
            handleClose()
        }, 3000);

        return () => clearInterval(timer);
    });

    return (
        <Transition
            appear={true}
            show={isOpen}
            unmount={false}
            className="absolute inset-x-0 z-40"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
            style={{ willChange: 'transform' }}
        >
            <Alert severity={alert?.type || 'info'} onClose={handleClose}>
                {alert?.message || ''}
            </Alert>
        </Transition>
    );
};
