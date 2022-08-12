import { Transition } from '@headlessui/react';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { useBackground } from '../../ui/hooks/useBackground';
import { Conversations } from './pages/Conversations';
import { Messages } from './pages/Messages';
import { NewConversation } from './pages/NewConversation';

export const MessagesApp = () => {
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[45%_90%] duration-500"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[45%_90%] duration-500"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <Routes>
                        <Route index element={<Conversations />} />
                        <Route path="new" element={<NewConversation />} />
                        <Route path="new/:phoneNumber" element={<NewConversation />} />

                        <Route path=":groupId" element={<Messages />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
