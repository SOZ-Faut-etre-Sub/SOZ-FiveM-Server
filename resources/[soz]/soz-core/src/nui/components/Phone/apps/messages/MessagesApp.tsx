import { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { Conversations } from './pages/Conversations';
import { Messages } from './pages/Messages';
import { NewConversation } from './pages/NewConversation';

export const MessagesApp: FunctionComponent = () => {
    return (
        <AppContainer>
            <Routes>
                <Route index element={<Conversations />} />
                <Route path="new" element={<NewConversation />} />
                <Route path="new/:phoneNumber" element={<NewConversation />} />

                <Route path=":conversationId" element={<Messages />} />
            </Routes>
        </AppContainer>
    );
};
