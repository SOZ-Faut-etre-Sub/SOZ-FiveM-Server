import './system/locale/i18n';

import { FunctionComponent } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { HomeApp } from './apps/home/HomeApp';
import { useAppNotesStateHandlers } from './apps/notes/notes.atom';
import { ActionSheet } from './system/action-sheet/components/ActionSheet';
import { useApps } from './system/apps/hooks/useApps';
import { usePhoneStateHandlers } from './system/phone.atom';
import { PhoneWrapper } from './system/PhoneWrapper';

export const PhoneApp: FunctionComponent = () => {
    const apps = useApps();

    usePhoneStateHandlers();

    // Apps
    useAppNotesStateHandlers();

    return (
        <MemoryRouter>
            <PhoneWrapper>
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
