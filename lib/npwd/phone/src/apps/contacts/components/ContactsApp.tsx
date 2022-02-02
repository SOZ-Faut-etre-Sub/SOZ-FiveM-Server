import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppTitle} from '@ui/components/AppTitle';
import {AppContent} from '@ui/components/AppContent';
import {useApp} from '@os/apps/hooks/useApps';
import {Route} from 'react-router-dom';
import ContactsInfoPage from './views/ContactInfo';
import {ContactPage} from './views/ContactsPage';
import {ContactsThemeProvider} from '../providers/ContactsThemeProvider';
import {useHistory, useLocation} from 'react-router';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';


export const ContactsApp: React.FC = () => {
    const contacts = useApp('CONTACTS');
    const history = useHistory();
    const {pathname} = useLocation();

    const pathTemplate = /contacts\/-?\d/;

    return (
        <ContactsThemeProvider>
            <AppWrapper id="contact-app">
                <AppTitle app={contacts}/>
                {/*{!pathname.match(pathTemplate) && (*/}
                {/*    <PersonAddIcon color="primary" style={{cursor: 'pointer'}} onClick={() => history.push('/contacts/-1')} />*/}
                {/*)}*/}
                <AppContent>
                    <React.Suspense fallback={<LoadingSpinner/>}>
                        <Route path="/contacts/" exact component={ContactPage}/>
                        <Route path="/contacts/:id" exact component={ContactsInfoPage}/>
                    </React.Suspense>
                </AppContent>
            </AppWrapper>
        </ContactsThemeProvider>
    );
};
