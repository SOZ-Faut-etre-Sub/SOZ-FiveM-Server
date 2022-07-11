import { Transition } from '@headlessui/react';
import { useApp } from '@os/apps/hooks/useApps';
import { AppWrapper } from '@ui/old_components';
import { AppContent } from '@ui/old_components/AppContent';
import { AppTitle } from '@ui/old_components/AppTitle';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ContactList } from '../../contacts/components/List/ContactList';
import DialerNavBar from './DialerNavBar';
import { DialerHistory } from './views/DialerHistory';
import DialPage from './views/DialPage';

export const DialerApp: React.FC = () => {
    const dialer = useApp('dialer');
    return (
        <Transition
            appear={true}
            show={true}
            className="mt-4 h-full flex flex-col"
            enter="transition-all origin-[20%_90%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[20%_90%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <AppTitle app={dialer} />
                <AppContent className="mt-5 h-[710px]">
                    <Routes>
                        <Route index element={<DialerHistory />} />
                        <Route path="dial" element={<DialPage />} />
                        <Route path="contacts" element={<ContactList />} />
                    </Routes>
                </AppContent>
                <DialerNavBar />
            </AppWrapper>
        </Transition>
    );
};
