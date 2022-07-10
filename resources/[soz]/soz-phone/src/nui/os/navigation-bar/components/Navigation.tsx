import { Transition } from '@headlessui/react';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import React, { useContext } from 'react';
import { useLocation, useNavigate, useRouteMatch } from 'react-router-dom';

import { ThemeContext } from '../../../styles/themeProvider';

export const Navigation = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { setBarUncollapsed } = useNotifications();
    const { theme } = useContext(ThemeContext);

    const color = () => {
        if (pathname === '/camera' || pathname === '/' || pathname === '/call') {
            return 'bg-gray-200';
        } else {
            return theme === 'dark' ? 'bg-gray-200' : 'bg-black';
        }
    };

    return (
        <Transition
            appear={true}
            show={true}
            className="absolute bottom-0 inset-x-px flex justify-center h-5 z-50"
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div
                className={`${color()} bg-opacity-70 rounded-full cursor-pointer h-[0.53rem] w-2/5 transition-colors ease-in-out duration-300`}
                onClick={() => {
                    navigate('/', { replace: true });
                    setBarUncollapsed(false);
                }}
            />
        </Transition>
    );
};
