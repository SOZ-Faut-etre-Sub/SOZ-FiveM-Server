import './Phone.css';

import { useApps } from '@os/apps/hooks/useApps';
import { CallModal } from '@os/call/components/CallModal';
import { useCall } from '@os/call/hooks/useCall';
import { useCallModal } from '@os/call/hooks/useCallModal';
import { useCallService } from '@os/call/hooks/useCallService';
import { useKeyboardService } from '@os/keyboard/hooks/useKeyboardService';
import { Navigation } from '@os/navigation-bar/components/Navigation';
import { NotificationAlert } from '@os/notifications/components/NotificationAlert';
import { NotificationBar } from '@os/notifications/components/NotificationBar';
import { useConfig } from '@os/phone/hooks/useConfig';
import { useSimcardService } from '@os/simcard/hooks/useSimcardService';
import { PhoneSnackbar } from '@os/snackbar/components/PhoneSnackbar';
import { PhoneEvents } from '@typings/phone';
import { TopLevelErrorComponent } from '@ui/old_components/TopLevelErrorComponent';
import dayjs from 'dayjs';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import DefaultConfig from '../../config.json';
import { useBankService } from './apps/bank/hooks/useBankService';
import { useContactsListener } from './apps/contacts/hooks/useContactsListener';
import { useDialService } from './apps/dialer/hooks/useDialService';
import { HomeApp } from './apps/home';
import { useMarketplaceService } from './apps/marketplace/hooks/useMarketplaceService';
import { useMessagesService } from './apps/messages/hooks/useMessageService';
import { useNoteListener } from './apps/notes/hooks/useNoteListener';
import { useSocietyMessagesService } from './apps/society-messages/hooks/useMessageService';
import { useTwitchNewsService } from './apps/twitch-news/hooks/useMessageService';
import { usePhoneConfig } from './hooks/usePhoneConfig';
import InjectDebugData from './os/debug/InjectDebugData';
import { NotificationsProvider } from './os/notifications/providers/NotificationsProvider';
import { usePhoneVisibility } from './os/phone/hooks/usePhoneVisibility';
import SnackbarProvider from './os/snackbar/providers/SnackbarProvider';
import { SoundProvider } from './os/sound/providers/SoundProvider';
import PhoneWrapper from './PhoneWrapper';
import { usePhoneService } from './services/usePhoneService';
import ThemeProvider from './styles/themeProvider';
import WindowSnackbar from './ui/old_components/WindowSnackbar';

function Phone() {
    const { apps } = useApps();

    // useConfig();

    // useKeyboardService();
    usePhoneService();
    // useSimcardService();
    // useMarketplaceService();
    // useBankService();
    // useMessagesService();
    // useContactsListener();
    // useNoteListener();
    // /*usePhotoService();*/
    // useSocietyMessagesService();
    // useTwitchNewsService();
    // useCallService();
    // useDialService();

    // const { modal: callModal } = useCallModal();
    // const { call } = useCall();
    //
    // const showNavigation = call?.is_accepted || !callModal;

    return (
        <SoundProvider>
            <ThemeProvider>
                <NotificationsProvider>
                    {/*        <SnackbarProvider>*/}
                    <PhoneWrapper>
                        {/*<TopLevelErrorComponent>*/}
                        {/*    <WindowSnackbar />*/}
                        {/*        <NotificationBar />*/}
                        <Routes>
                            <Route path="/" element={<HomeApp />} />
                            {/*{callModal && <Route path="/call" element={<CallModal />} />}*/}
                            {apps.map(app => (
                                <Route key={app.id} path={app.path} element={app.component} />
                            ))}
                        </Routes>
                        {/*            <NotificationAlert />*/}
                        {/*            <PhoneSnackbar />*/}
                        {/*        {showNavigation && <Navigation />}*/}
                        {/*</TopLevelErrorComponent>*/}
                        {/*        </SnackbarProvider>*/}
                    </PhoneWrapper>
                </NotificationsProvider>
            </ThemeProvider>
        </SoundProvider>
    );
}

export default Phone;

InjectDebugData<any>([
    {
        app: 'PHONE',
        method: PhoneEvents.SET_VISIBILITY,
        data: true,
    },
    {
        app: 'PHONE',
        method: PhoneEvents.SET_PHONE_READY,
        data: true,
    },
    {
        app: 'PHONE',
        method: PhoneEvents.SET_TIME,
        data: dayjs().format('hh:mm'),
    },
    {
        app: 'PHONE',
        method: PhoneEvents.SET_CONFIG,
        data: DefaultConfig,
    },
]);
