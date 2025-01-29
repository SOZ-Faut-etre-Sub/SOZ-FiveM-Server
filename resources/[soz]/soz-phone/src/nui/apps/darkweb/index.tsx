import {Transition} from '@headlessui/react';
import {FullPageWithHeader} from '@ui/layout/FullPageWithHeader';
import {Route, Routes} from 'react-router-dom';

import {AppWrapper} from '../../ui/components/AppWrapper';
import {DarkChatMessages} from '../../../../../soz-core/src/nui/components/Phone/apps/darkweb/pages/DarkChatMessages';
import {DarkWebIntro} from './pages/DarkwebIntro';
import {DarkChatConversations} from '../../../../../soz-core/src/nui/components/Phone/apps/darkweb/pages/DarkChatConversations';

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
                <AppWrapper className="h-[775px] w-full">
                    <Routes>
                        <Route index element={<DarkWebIntro/>}/>
                        <Route path="/conversations/" element={<DarkChatConversations/>}/>
                        <Route path="/conversations/:conversationId" element={<DarkChatMessages/>}/>
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
