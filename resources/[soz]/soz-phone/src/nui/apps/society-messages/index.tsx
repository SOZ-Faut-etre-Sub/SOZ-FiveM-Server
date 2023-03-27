import { Transition } from '@headlessui/react';
import { ChatIcon } from '@heroicons/react/outline';
import { useApp } from '@os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import cn from 'classnames';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useSociety } from '../../../nui/hooks/app/useSociety';
import { useConfig } from '../../../nui/hooks/usePhone';
import { usePhoneSocietyNumber } from '../../hooks/useSimCard';
import { useBackground } from '../../ui/hooks/useBackground';
import MessagesList from './pages/MessagesList';

export const SocietyMessagesApp = () => {
    const messages = useApp('society-messages');
    const backgroundClass = useBackground();

    const config = useConfig();
    const navigate = useNavigate();
    const { getContacts } = useSociety();
    const contacts = getContacts();
    const societyNumber = usePhoneSocietyNumber();
    const societyId = contacts.find(c => c.number == societyNumber)?.id;

    const openContactInfo = (contactId: number) => {
        navigate(`/society-contacts/${contactId}`);
    };

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
                    <div className="flex flex-row justify-between pr-4">
                        <AppTitle app={messages} />
                        <button onClick={() => openContactInfo(societyId)}>
                            <ChatIcon
                                className={cn('h-5 w-5 mx-2', {
                                    'text-white': config.theme.value === 'dark',
                                    'text-black': config.theme.value === 'light',
                                })}
                            />
                        </button>
                    </div>
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
