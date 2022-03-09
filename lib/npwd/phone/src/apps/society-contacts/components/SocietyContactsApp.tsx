import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppTitle} from '@ui/components/AppTitle';
import {AppContent} from '@ui/components/AppContent';
import {useApp} from '@os/apps/hooks/useApps';
import {LoadingSpinner} from "@ui/components/LoadingSpinner";
import {Route} from "react-router-dom";
import ContactsInfoPage from "./views/ContactInfo";
import {ContactList} from "./List/ContactList";

export const SocietyContactsApp: React.FC = () => {
    const contacts = useApp('SOCIETY_CONTACTS');

    return (
        <AppWrapper>
            <AppTitle app={contacts}/>
            <AppContent>
                <React.Suspense fallback={<LoadingSpinner/>}>
                    <Route path="/society-contacts/" exact component={ContactList}/>
                    <Route path="/society-contacts/:id" exact component={ContactsInfoPage}/>
                </React.Suspense>
            </AppContent>
        </AppWrapper>
    );
};
