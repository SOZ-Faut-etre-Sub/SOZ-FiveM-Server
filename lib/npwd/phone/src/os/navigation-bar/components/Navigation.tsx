import React, {useContext} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import { Transition } from '@headlessui/react';
import {ThemeContext} from "../../../styles/themeProvider";

export const Navigation = () => {
    const history = useHistory();
    const home = useRouteMatch('/');
    const camera = useRouteMatch('/camera');
    const {theme} = useContext(ThemeContext);

    const color = () => {
        if ((camera && camera.isExact) || (home && home.isExact)) {
            return 'bg-gray-200'
        } else {
            return theme === 'dark' ? 'bg-gray-200' : 'bg-black'
        }
    }

    return (
        <Transition
            appear={true}
            show={true}
            className="absolute bottom-0 inset-x-px flex justify-center items-center h-10 z-50"
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={`${color()} bg-opacity-70 rounded-full cursor-pointer h-[0.53rem] w-2/5 transition-colors ease-in-out duration-300`} onClick={() => history.push('/')}/>
        </Transition>
    );
};
