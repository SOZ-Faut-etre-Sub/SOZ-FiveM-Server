import { Transition } from '@headlessui/react';
import { useApp } from '@os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { useBackground } from '../../ui/hooks/useBackground';
import MessagesList from './pages/MessagesList';

export const SocietyMessagesApp = () => {
    const messages = useApp('society-messages');
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[10%_20%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[10%_20%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <AppTitle app={messages} />
                    <AppContent>
                        <Routes>
                            <Route index element={<MessagesList />} />
                        </Routes>
                    </AppContent>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
