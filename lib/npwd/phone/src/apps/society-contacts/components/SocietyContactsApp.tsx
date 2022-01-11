import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import { ContactsThemeProvider } from '../providers/ContactsThemeProvider';
import {LoadingSpinner} from "@ui/components/LoadingSpinner";
import {Route} from "react-router-dom";
import {ContactPage} from "./views/ContactsPage";
import ContactsInfoPage from "./views/ContactInfo";

export const SocietyContactsApp: React.FC = () => {
  const contacts = useApp('SOCIETY_CONTACTS');

  return (
    <ContactsThemeProvider>
      <AppWrapper id="society-contact-app">
        <AppTitle app={contacts} />
        <AppContent>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/society-contacts/" exact component={ContactPage} />
            <Route path="/society-contacts/:id" exact component={ContactsInfoPage} />
          </React.Suspense>
        </AppContent>
      </AppWrapper>
    </ContactsThemeProvider>
  );
};
