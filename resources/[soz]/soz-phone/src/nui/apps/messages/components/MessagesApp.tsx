import { Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { useApp } from '@os/apps/hooks/useApps';
import { AppWrapper } from '@ui/old_components';
import { AppContent } from '@ui/old_components/AppContent';
import { AppTitle } from '@ui/old_components/AppTitle';
import { LoadingSpinner } from '@ui/old_components/LoadingSpinner';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import MessagesList from './list/MessagesList';
import MessageGroupModal from './modal/MessageGroupModal';
import { MessageModal } from './modal/MessageModal';

export const MessagesApp = () => {
    const messages = useApp('messages');

    return (
        <Transition
            appear={true}
            show={true}
            className="mt-4 h-full flex flex-col"
            enter="transition-all origin-[45%_90%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[45%_90%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <AppTitle
                    app={messages}
                    action={
                        <Link to="/messages/new">
                            <PlusIcon className="h-6 w-6 cursor-pointer" />
                        </Link>
                    }
                >
                    <div />
                </AppTitle>
                <AppContent>
                    <React.Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            <Route index element={<MessagesList />} />
                            <Route path="new" element={<MessageGroupModal />} />
                            <Route path="new/:phoneNumber" element={<MessageGroupModal />} />

                            <Route path="conversations/:groupId" element={<MessageModal />} />
                        </Routes>
                    </React.Suspense>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
