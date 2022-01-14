import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import MessagesList from './list/MessagesList';
import { Route } from 'react-router-dom';
import { MessagesThemeProvider } from '../providers/MessagesThemeProvider';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const SocietyMessagesApp = () => {
  const messages = useApp('SOCIETY_MESSAGES');

  return (
    <MessagesThemeProvider>
      <AppWrapper id="messages-app">
        <AppTitle app={messages} />
        <AppContent>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/society-messages" exact component={MessagesList} />
          </React.Suspense>
        </AppContent>
      </AppWrapper>
    </MessagesThemeProvider>
  );
};
