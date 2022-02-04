import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppTitle} from '@ui/components/AppTitle';
import {AppContent} from '@ui/components/AppContent';
import {useApp} from '@os/apps/hooks/useApps';
import {LoadingSpinner} from "@ui/components/LoadingSpinner";
import {Route} from "react-router-dom";
import ContactsInfoPage from "./views/ContactInfo";
import { Transition } from '@headlessui/react';
import {ContactList} from "./List/ContactList";

export const SocietyContactsApp: React.FC = () => {
    const contacts = useApp('SOCIETY_CONTACTS');

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
                <AppTitle app={contacts}/>
                <AppContent>
                    <React.Suspense fallback={<LoadingSpinner/>}>
                        <Route path="/society-contacts/" exact component={ContactList}/>
                        <Route path="/society-contacts/:id" exact component={ContactsInfoPage}/>
                    </React.Suspense>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
