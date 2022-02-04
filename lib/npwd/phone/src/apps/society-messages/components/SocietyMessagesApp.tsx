import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppTitle} from '@ui/components/AppTitle';
import {AppContent} from '@ui/components/AppContent';
import {useApp} from '@os/apps/hooks/useApps';
import MessagesList from './list/MessagesList';
import {Route} from 'react-router-dom';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';
import { Transition } from '@headlessui/react';

export const SocietyMessagesApp = () => {
    const messages = useApp('SOCIETY_MESSAGES');

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
                <AppTitle app={messages}/>
                <AppContent>
                    <React.Suspense fallback={<LoadingSpinner/>}>
                        <Route path="/society-messages" exact component={MessagesList}/>
                    </React.Suspense>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
