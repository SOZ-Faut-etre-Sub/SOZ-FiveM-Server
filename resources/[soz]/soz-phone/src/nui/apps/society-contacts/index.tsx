import { Transition } from '@headlessui/react';
import { AppWrapper } from '@ui/components/AppWrapper';
import { useBackground } from '@ui/hooks/useBackground';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ContactsInfoPage from './pages/ContactInfo';
import { ContactList } from './pages/ContactList';

export const SocietyContactsApp: React.FC = () => {
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                className="mt-4 h-full flex flex-col"
                enter="transition-all origin-[70%_10%] duration-500"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[70%_10%] duration-500"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <Routes>
                        <Route index element={<ContactList />} />
                        <Route path=":id" element={<ContactsInfoPage />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
