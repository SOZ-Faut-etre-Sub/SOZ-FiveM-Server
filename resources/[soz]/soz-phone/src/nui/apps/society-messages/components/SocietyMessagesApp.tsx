import { Transition } from '@headlessui/react';
import { useApp } from '@os/apps/hooks/useApps';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import React from 'react';
import { Route } from 'react-router-dom';

import MessagesList from './list/MessagesList';

export const SocietyMessagesApp = () => {
    const messages = useApp('society-messages');

    return (
        <Transition
            appear={true}
            show={true}
            className="mt-4 h-full flex flex-col"
            enter="transition-all origin-[10%_20%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[10%_20%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <AppTitle app={messages} />
                <AppContent className="mt-4 h-[750px] overflow-scroll">
                    <React.Suspense fallback={<LoadingSpinner />}>
                        <Route path="/society-messages" exact component={MessagesList} />
                    </React.Suspense>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
