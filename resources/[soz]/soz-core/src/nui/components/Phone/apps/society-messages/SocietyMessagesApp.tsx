import { FunctionComponent } from 'react';
import { HiMiniBellAlert } from 'react-icons/hi2';
import { MdOutlinePublic } from 'react-icons/md';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { useSocietySimCard } from '../../system/sim-card/hooks/useSocietySimCard';
import { alerts } from './messages.constant';
import { MessagesList } from './pages/MessagesList';

export const SocietyMessagesApp: FunctionComponent = () => {
    const { canUseDynamicAlerts } = useSocietySimCard();

    return (
        <AppContainer
            tabBarOptions={
                canUseDynamicAlerts
                    ? [
                          {
                              label: 'Public',
                              path: '/society-messages',
                              icon: MdOutlinePublic,
                          },
                          {
                              label: 'Alertes',
                              path: '/society-messages/alerts',
                              icon: HiMiniBellAlert,
                          },
                      ]
                    : []
            }
        >
            <Routes>
                <Route index element={<MessagesList exclude={canUseDynamicAlerts && alerts} />} />
                <Route path="alerts" element={<MessagesList filter={canUseDynamicAlerts && alerts} />} />
            </Routes>
        </AppContainer>
    );
};
