import { Transition } from '@headlessui/react';
import { useApp } from '@os/apps/hooks/useApps';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import React from 'react';
import { Route } from 'react-router-dom';

import { ContactList } from './List/ContactList';
import ContactsInfoPage from './views/ContactInfo';

export const SocietyContactsApp: React.FC = () => {
    const contacts = useApp('society-contacts');

    return (
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
                <AppTitle app={contacts} />
                <AppContent>
                    <React.Suspense fallback={<LoadingSpinner />}>
                        <Route path="/society-contacts/" exact component={ContactList} />
                        <Route path="/society-contacts/:id" exact component={ContactsInfoPage} />
                    </React.Suspense>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
