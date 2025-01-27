import './system/locale/i18n';

import { FunctionComponent } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { useNuiFocus } from '../../hook/nui';
import { useAppBankStateHandlers } from './apps/bank/bank.atom';
import { useAppDarkWebStateHandlers } from './apps/darkweb/darkweb.atom';
import { CallModalApp } from './apps/dialer/CallModalApp';
import { HomeApp } from './apps/home/HomeApp';
import { useAppNewsStateHandlers } from './apps/news/news.atom';
import { useAppNotesStateHandlers } from './apps/notes/notes.atom';
import { useAppPhotosStateHandlers } from './apps/photos/photos.atom';
import { useAppSnakeStateHandlers } from './apps/snake/snake.atom';
import { useSocietyMessagesStateHandlers } from './apps/society-messages/messages.atom';
import { useAppTetrisStateHandlers } from './apps/tetris/tetris.atom';
import { useAppWeatherStateHandlers } from './apps/weather/weather.atom';
import { ActionSheet } from './system/action-sheet/components/ActionSheet';
import { Alerts } from './system/alerts/components/Alerts';
import { useApps } from './system/apps/hooks/useApps';
import { CallDynamicIsland } from './system/dynamic-island/components/CallDynamicIsland';
import { usePhoneFocus, usePhoneStateHandlers } from './system/phone.atom';
import { PhoneWrapper } from './system/PhoneWrapper';
import { useSimCardStateHandlers } from './system/sim-card/sim.card.atom';
import { SoundProvider } from './system/sound/providers/SoundProvider';

export const PhoneApp: FunctionComponent = () => {
    const apps = useApps();
    const focus = usePhoneFocus();

    useNuiFocus(focus, focus, focus, null, focus);

    return (
        <SoundProvider>
            <PhoneAppHooks />

            <MemoryRouter>
                <PhoneWrapper>
                    <Alerts />
                    <ActionSheet />
                    <CallDynamicIsland />

                    <Routes>
                        <Route path="/call" element={<CallModalApp />} />

                        <Route index element={<HomeApp />} />
                        {/*<Route path="/emergency" element={<EmergencyModal />} />*/}

                        {apps.map(app => (
                            <Route key={app.id} path={app.path + '/*'} element={app.component} />
                        ))}
                    </Routes>
                </PhoneWrapper>
            </MemoryRouter>
        </SoundProvider>
    );
};

const PhoneAppHooks: FunctionComponent = () => {
    usePhoneStateHandlers();
    useSimCardStateHandlers();

    // System Apps
    useAppPhotosStateHandlers();

    // Apps
    useAppBankStateHandlers();
    useAppDarkWebStateHandlers();
    useAppNewsStateHandlers();
    useAppNotesStateHandlers();
    useAppTetrisStateHandlers();
    useAppSnakeStateHandlers();
    useAppWeatherStateHandlers();
    useSocietyMessagesStateHandlers();

    return null;
};
