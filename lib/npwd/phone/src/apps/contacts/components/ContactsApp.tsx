import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppContent} from '@ui/components/AppContent';
import {Route, useHistory} from 'react-router-dom';
import ContactsInfoPage from './views/ContactInfo';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';
import {ContactList} from "./List/ContactList";
import {PlusIcon} from "@heroicons/react/outline";
import {AppTitle} from "@ui/components/AppTitle";
import {useLocation} from "react-router-dom";
import {useApp} from "@os/apps/hooks/useApps";


export const ContactsApp: React.FC = () => {
    const contacts = useApp('CONTACTS');
    const {pathname} = useLocation();
    const history = useHistory();

    const pathTemplate = /contacts\/-?\d/;

    return (
        <AppWrapper>
            <AppTitle app={contacts} action={!pathname.match(pathTemplate) && (
                <PlusIcon className="h-6 w-6 cursor-pointer" onClick={() => history.push('/contacts/-1')}/>
            )}>
                <div/>
            </AppTitle>
            <AppContent>
                <React.Suspense fallback={<LoadingSpinner/>}>
                    <Route path="/contacts/" exact component={ContactList}/>
                    <Route path="/contacts/:id" exact component={ContactsInfoPage}/>
                </React.Suspense>
            </AppContent>
        </AppWrapper>
    );
};
