import { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { DarkChatConversations } from './pages/DarkChatConversations';
import { DarkChatMessages } from './pages/DarkChatMessages';
import { DarkWebIntro } from './pages/DarkWebIntro';

export const DarkWebApp: FunctionComponent = () => {
    return (
        <AppContainer forceControlColor="light">
            <Routes>
                <Route index element={<DarkWebIntro />} />

                <Route path="/conversations">
                    <Route index element={<DarkChatConversations />} />
                    <Route path=":conversationId" element={<DarkChatMessages />} />
                </Route>
            </Routes>
        </AppContainer>
    );
};
