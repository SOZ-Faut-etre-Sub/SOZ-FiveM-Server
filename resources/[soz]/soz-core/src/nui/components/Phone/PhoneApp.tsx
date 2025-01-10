import './system/locale/i18n';

import { FunctionComponent } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { useNuiFocus } from '../../hook/nui';
import { useAppBankStateHandlers } from './apps/bank/bank.atom';
import { useAppDarkWebStateHandlers } from './apps/darkweb/darkweb.atom';
import { HomeApp } from './apps/home/HomeApp';
import { useAppNewsStateHandlers } from './apps/news/news.atom';
import { useAppNotesStateHandlers } from './apps/notes/notes.atom';
import { useAppPhotosStateHandlers } from './apps/photos/photos.atom';
import { useAppTetrisStateHandlers } from './apps/tetris/tetris.atom';
import { useAppWeatherStateHandlers } from './apps/weather/weather.atom';
import { ActionSheet } from './system/action-sheet/components/ActionSheet';
import { Alerts } from './system/alerts/components/Alerts';
import { useApps } from './system/apps/hooks/useApps';
import { usePhoneStateHandlers, usePhoneVisibility } from './system/phone.atom';
import { PhoneWrapper } from './system/PhoneWrapper';
import { useSimCardStateHandlers } from './system/sim-card/sim.card.atom';

export const PhoneApp: FunctionComponent = () => {
    const apps = useApps();
    const visible = usePhoneVisibility();

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
    useAppWeatherStateHandlers();

    useNuiFocus(visible, visible, visible, null, visible);

    return (
        <MemoryRouter>
            <PhoneWrapper>
                <Alerts />
                <ActionSheet />

                <Routes>
                    <Route index element={<HomeApp />} />
                    {/*<Route path="/call" element={<CallModal />} />*/}
                    {/*<Route path="/emergency" element={<EmergencyModal />} />*/}

                    {apps.map(app => (
                        <Route key={app.id} path={app.path + '/*'} element={app.component} />
                    ))}
                </Routes>
            </PhoneWrapper>
        </MemoryRouter>
    );
};
