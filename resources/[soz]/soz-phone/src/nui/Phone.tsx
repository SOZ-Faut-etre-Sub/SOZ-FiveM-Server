import { useApps } from '@os/apps/hooks/useApps';
import { CallModal } from '@os/call/components/CallModal';
import { useCallService } from '@os/call/hooks/useCallService';
import { useKeyboardService } from '@os/keyboard/hooks/useKeyboardService';
import { useConfig } from '@os/phone/hooks/useConfig';
import { useSimcardService } from '@os/simcard/hooks/useSimcardService';
import { PhoneEvents } from '@typings/phone';
import dayjs from 'dayjs';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import DefaultConfig from '../../config.json';
import { BankEvents } from '../../typings/app/bank';
import { useContactsListener } from './apps/contacts/hooks/useContactsListener';
import { useDialService } from './apps/dialer/hooks/useDialService';
import { HomeApp } from './apps/home';
import { useMarketplaceService } from './apps/marketplace/hooks/useMarketplaceService';
import { useMessagesService } from './apps/messages/hooks/useMessageService';
import { useNoteListener } from './apps/notes/hooks/useNoteListener';
import { useSocietyMessagesService } from './apps/society-messages/hooks/useMessageService';
import { useTwitchNewsService } from './apps/twitch-news/hooks/useMessageService';
import InjectDebugData from './os/debug/InjectDebugData';
import { NotificationAlert } from './os/notifications/components/NotificationAlert';
import { PhoneSnackbar } from './os/snackbar/components/PhoneSnackbar';
import PhoneWrapper from './PhoneWrapper';
import { useAppBankService } from './services/app/useAppBankService';
import { usePhoneService } from './services/usePhoneService';
import ThemeProvider from './styles/themeProvider';
import { LoadingSpinner } from './ui/old_components/LoadingSpinner';

function Phone() {
    const { apps } = useApps();
    useConfig();

    useKeyboardService();
    usePhoneService();
    useSimcardService();
    useMarketplaceService();
    useMessagesService();
    useContactsListener();
    useNoteListener();
    /*usePhotoService();*/
    useSocietyMessagesService();
    useTwitchNewsService();
    useCallService();
    useDialService();
    // Apps services
    useAppBankService();

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
    {
        app: 'BANK',
        method: BankEvents.SEND_CREDENTIALS,
        data: {
            name: 'John Doe',
            account: '555Z5555T555',
            balance: 1258745,
        },
    },
]);
