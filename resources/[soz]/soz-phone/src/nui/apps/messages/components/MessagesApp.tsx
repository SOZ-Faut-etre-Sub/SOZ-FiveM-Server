import { Transition } from '@headlessui/react';
import { AppContent } from '@ui/components/AppContent';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { useBackground } from '../../../ui/hooks/useBackground';
import MessagesList from './list/MessagesList';
import MessageGroupModal from './modal/MessageGroupModal';
import { MessageModal } from './modal/MessageModal';

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
                    <AppContent>
                        <Routes>
                            <Route index element={<MessagesList />} />
                            <Route path="new" element={<MessageGroupModal />} />
                            <Route path="new/:phoneNumber" element={<MessageGroupModal />} />

                            <Route path="conversations/:groupId" element={<MessageModal />} />
                        </Routes>
                    </AppContent>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
