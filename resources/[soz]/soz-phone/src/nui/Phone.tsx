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
import { usePhoneService } from '@os/phone/hooks/usePhoneService';
import { useSimcardService } from '@os/simcard/hooks/useSimcardService';
import { PhoneSnackbar } from '@os/snackbar/components/PhoneSnackbar';
import { PhoneEvents } from '@typings/phone';
import { TopLevelErrorComponent } from '@ui/old_components/TopLevelErrorComponent';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route } from 'react-router-dom';

import DefaultConfig from '../../config.json';
import { useBankService } from './apps/bank/hooks/useBankService';
import { useContactsListener } from './apps/contacts/hooks/useContactsListener';
import { useDialService } from './apps/dialer/hooks/useDialService';
import { HomeApp } from './apps/home/components/Home';
import { useMarketplaceService } from './apps/marketplace/hooks/useMarketplaceService';
import { useMessagesService } from './apps/messages/hooks/useMessageService';
import { useNoteListener } from './apps/notes/hooks/useNoteListener';
import { useSettings } from './apps/settings/hooks/useSettings';
import { useSocietyMessagesService } from './apps/society-messages/hooks/useMessageService';
import { useTwitchNewsService } from './apps/twitch-news/hooks/useMessageService';
import InjectDebugData from './os/debug/InjectDebugData';
import PhoneWrapper from './PhoneWrapper';
import WindowSnackbar from './ui/old_components/WindowSnackbar';

function Phone() {
    const { i18n } = useTranslation();

    const { apps } = useApps();
    const [settings] = useSettings();

    // Set language from local storage
    // This will only trigger on first mount & settings changes
    useEffect(() => {
        i18n.changeLanguage(settings.language.value).catch(e => console.error(e));
    }, [i18n, settings.language]);

    useConfig();

    useKeyboardService();
    usePhoneService();
    useSimcardService();
    useMarketplaceService();
    useBankService();
    useMessagesService();
    useContactsListener();
    useNoteListener();
    /*usePhotoService();*/
    useSocietyMessagesService();
    useTwitchNewsService();
    useCallService();
    useDialService();

    const { modal: callModal } = useCallModal();
    const { call } = useCall();

    const showNavigation = call?.is_accepted || !callModal;

    return (
        <div>
            <TopLevelErrorComponent>
                <WindowSnackbar />
                <PhoneWrapper>
                    <NotificationBar />
                    <div className="PhoneAppContainer select-none">
                        <>
                            <Route exact path="/" component={HomeApp} />
                            {callModal && <Route exact path="/call" component={CallModal} />}
                            {apps.map(App => (
                                <App.Route key={App.id} />
                            ))}
                        </>
                        <NotificationAlert />
                        <PhoneSnackbar />
                    </div>
                    {showNavigation && <Navigation />}
                </PhoneWrapper>
            </TopLevelErrorComponent>
        </div>
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
