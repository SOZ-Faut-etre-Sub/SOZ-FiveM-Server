import { useApps } from '@os/apps/hooks/useApps';
import { CallModal } from '@os/call/components/CallModal';
import { useCallService } from '@os/call/hooks/useCallService';
import { useConfig } from '@os/phone/hooks/useConfig';
import { useSimcardService } from '@os/simcard/hooks/useSimcardService';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { HomeApp } from './apps/home';
import { NotificationAlert } from './os/notifications/components/NotificationAlert';
import { PhoneSnackbar } from './os/snackbar/components/PhoneSnackbar';
import PhoneWrapper from './PhoneWrapper';
import { useAppBankService } from './services/app/useAppBankService';
import { useAppNotesService } from './services/app/useAppNotesService';
import { useAppSocietyService } from './services/app/useAppSocietyService';
import { useAppTwitchNewsService } from './services/app/useAppTwitchNewsService';
import { useContactService } from './services/useContactService';
import { useDebugService } from './services/useDebugService';
import { useKeyboardService } from './services/useKeyboardService';
import { useMessagesService } from './services/useMessagesService';
import { usePhoneService } from './services/usePhoneService';
import { usePhotoService } from './services/usePhotoService';
import { useSimCardService } from './services/useSimCardService';
import ThemeProvider from './styles/themeProvider';

function Phone() {
    const { apps } = useApps();
    useConfig();

    useDebugService();

    usePhoneService();
    useSimcardService();
    useCallService();

    // Core services
    useKeyboardService();
    useSimCardService();
    useContactService();
    useMessagesService();
    usePhotoService();

    // Apps services
    useAppBankService();
    useAppNotesService();
    useAppTwitchNewsService();
    useAppSocietyService();

    return (
        <ThemeProvider>
            <PhoneWrapper>
                {/*<TopLevelErrorComponent>*/}
                {/*    <WindowSnackbar />*/}
                <NotificationAlert />
                <PhoneSnackbar />
                <Routes>
                    <Route path="/" element={<HomeApp />} />
                    <Route path="/call" element={<CallModal />} />
                    {apps.map(app => (
                        <Route key={app.id} path={app.path + '/*'} element={app.component} />
                    ))}
                </Routes>
                {/*</TopLevelErrorComponent>*/}
            </PhoneWrapper>
        </ThemeProvider>
    );
}

export default Phone;
