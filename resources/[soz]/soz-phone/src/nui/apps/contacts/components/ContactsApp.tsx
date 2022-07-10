import { Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { useApp } from '@os/apps/hooks/useApps';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { ContactList } from './List/ContactList';
import ContactsInfoPage from './views/ContactInfo';

export const ContactsApp: React.FC = () => {
    const contacts = useApp('contacts');
    const { pathname } = useLocation();
    const history = useHistory();

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
                            <PlusIcon className="h-6 w-6 cursor-pointer" onClick={() => history.push('/contacts/-1')} />
                        )
                    }
                >
                    <div />
                </AppTitle>
                <AppContent>
                    <React.Suspense fallback={<LoadingSpinner />}>
                        <Route path="/contacts/" exact component={ContactList} />
                        <Route path="/contacts/:id" exact component={ContactsInfoPage} />
                    </React.Suspense>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
