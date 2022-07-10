import { Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { useApp } from '@os/apps/hooks/useApps';
import { AppWrapper } from '@ui/old_components';
import { AppContent } from '@ui/old_components/AppContent';
import { AppTitle } from '@ui/old_components/AppTitle';
import { LoadingSpinner } from '@ui/old_components/LoadingSpinner';
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { ContactList } from './List/ContactList';
import ContactsInfoPage from './views/ContactInfo';

export const ContactsApp: React.FC = () => {
    const contacts = useApp('contacts');
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const pathTemplate = /contacts\/-?\d/;

    return (
        <Transition
            appear={true}
            show={true}
            className="mt-4 h-full flex flex-col"
            enter="transition-all origin-[70%_90%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[70%_90%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <AppTitle
                    app={contacts}
                    action={
                        !pathname.match(pathTemplate) && (
                            <PlusIcon className="h-6 w-6 cursor-pointer" onClick={() => navigate('/contacts/-1')} />
                        )
                    }
                >
                    <div />
                </AppTitle>
                <AppContent>
                    <React.Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            <Route path="/contacts/" element={<ContactList />} />
                            <Route path="/contacts/:id" element={<ContactsInfoPage />} />
                        </Routes>
                    </React.Suspense>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
