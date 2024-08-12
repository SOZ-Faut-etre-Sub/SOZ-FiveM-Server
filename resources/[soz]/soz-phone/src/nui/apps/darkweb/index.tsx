import { Transition } from '@headlessui/react';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import { Route, Routes } from 'react-router-dom';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { DarkWebConversation } from './pages/DarkwebConversation';
import { DarkWebIntro } from './pages/DarkwebIntro';
import { DarkWebList } from './pages/DarkwebList';

export const DarkWebApp = () => {
    return (
        <FullPageWithHeader className={'bg-gradient-to-t from-zinc-900 from-40% via-zinc-900 via-10% to-teal-900'}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[35%_10%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[35%_10%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <Routes>
                        <Route index element={<DarkWebIntro />} />
                        <Route path="/conversations/" element={<DarkWebList />} />
                        <Route path="/conversations/:conversationId" element={<DarkWebConversation />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
