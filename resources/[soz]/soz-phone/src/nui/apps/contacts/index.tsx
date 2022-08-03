import { Transition } from '@headlessui/react';
import { AppContent } from '@ui/components/AppContent';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { useBackground } from '../../ui/hooks/useBackground';
import ContactsInfoPage from './pages/ContactInfo';
import { ContactList } from './pages/ContactList';

export const ContactsApp: React.FC = () => {
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[70%_90%] duration-500"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[70%_90%] duration-500"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <AppContent scrollable={false}>
                        <Routes>
                            <Route index element={<ContactList />} />
                            <Route path=":id" element={<ContactsInfoPage />} />
                        </Routes>
                    </AppContent>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
