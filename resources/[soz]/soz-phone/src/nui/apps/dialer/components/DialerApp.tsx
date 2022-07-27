import { Transition } from '@headlessui/react';
import { useApp } from '@os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { useBackground } from '../../../ui/hooks/useBackground';
import { ContactList } from '../../contacts/components/List/ContactList';
import DialerNavBar from './DialerNavBar';
import { DialerHistory } from './views/DialerHistory';
import DialPage from './views/DialPage';

export const DialerApp: React.FC = () => {
    const dialer = useApp('dialer');
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[20%_90%] duration-500"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[20%_90%] duration-500"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <AppTitle app={dialer} />
                    <AppContent className="flex flex-col justify-between h-[780px]">
                        <Routes>
                            <Route index element={<DialerHistory />} />
                            <Route path="dial" element={<DialPage />} />
                            <Route path="contacts" element={<ContactList />} />
                        </Routes>
                        <DialerNavBar />
                    </AppContent>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
