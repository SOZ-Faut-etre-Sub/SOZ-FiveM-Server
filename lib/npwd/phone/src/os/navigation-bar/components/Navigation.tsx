import React from 'react';
import {useHistory} from 'react-router-dom';
import { Transition } from '@headlessui/react';

export const Navigation = () => {
    const history = useHistory();

    return (
        <Transition
            appear={true}
            show={true}
            className="absolute bottom-0 inset-x-px flex justify-center items-center h-10 z-10"
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="bg-gray-200 bg-opacity-70 rounded-full cursor-pointer h-[0.6rem] w-2/5" onClick={() => history.push('/')}/>
        </Transition>
    );
};
