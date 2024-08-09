import { Transition } from '@headlessui/react';
import { ReactNode } from 'react';

const TransitionTax = ({ children }: { children: ReactNode }) => (
    <Transition
        appear={true}
        show={true}
        enter="transform transition ease-in-out duration-300"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        className={'p-2'}
    >
        {children}
    </Transition>
);

export default TransitionTax;
