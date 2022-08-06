import { useApps } from '@os/apps/hooks/useApps';
import { CallModal } from '@os/call/components/CallModal';
import { useCallService } from '@os/call/hooks/useCallService';
import { useKeyboardService } from '@os/keyboard/hooks/useKeyboardService';
import { useConfig } from '@os/phone/hooks/useConfig';
import { useSimcardService } from '@os/simcard/hooks/useSimcardService';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { HomeApp } from './apps/home';
import { useMarketplaceService } from './apps/marketplace/hooks/useMarketplaceService';
import { useNoteListener } from './apps/notes/hooks/useNoteListener';
import { NotificationAlert } from './os/notifications/components/NotificationAlert';
import { PhoneSnackbar } from './os/snackbar/components/PhoneSnackbar';
import PhoneWrapper from './PhoneWrapper';
import { useAppBankService } from './services/app/useAppBankService';
import { useAppSocietyService } from './services/app/useAppSocietyService';
import { useAppTwitchNewsService } from './services/app/useAppTwitchNewsService';
import { useContactService } from './services/useContactService';
import { useDebugService } from './services/useDebugService';
import { useMessagesService } from './services/useMessagesService';
import { usePhoneService } from './services/usePhoneService';
import { useSimCardService } from './services/useSimCardService';
import ThemeProvider from './styles/themeProvider';
import { LoadingSpinner } from './ui/old_components/LoadingSpinner';

function Phone() {
    const { apps } = useApps();
    useConfig();

    useDebugService();

    useKeyboardService();
    usePhoneService();
    useSimcardService();
    useMarketplaceService();
    useNoteListener();
    useCallService();

    // Core services
    useSimCardService();
    useContactService();
    useMessagesService();

    // Apps services
    useAppBankService();
    useAppTwitchNewsService();
    useAppSocietyService();

    return (
        <ThemeProvider>
            <PhoneWrapper>
                {/*<TopLevelErrorComponent>*/}
                {/*    <WindowSnackbar />*/}
                <NotificationAlert />
                <PhoneSnackbar />
                <React.Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<HomeApp />} />
                        <Route path="/call" element={<CallModal />} />
                        {apps.map(app => (
                            <Route key={app.id} path={app.path + '/*'} element={app.component} />
                        ))}
                    </Routes>
                </React.Suspense>
                {/*</TopLevelErrorComponent>*/}
            </PhoneWrapper>
        </ThemeProvider>
    );
}

export default Phone;
