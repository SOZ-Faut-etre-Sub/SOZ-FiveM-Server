import { useApps } from '@os/apps/hooks/useApps';
import { CallModal } from '@os/call/components/CallModal';
import { Route, Routes } from 'react-router-dom';

import { HomeApp } from './apps/home';
import { useEmergency } from './hooks/useEmergency';
import { useCallModal, useConfig } from './hooks/usePhone';
import { EmergencyModal } from './os/emergency/components/EmergencyModal';
import { NotificationAlert } from './os/notifications/components/NotificationAlert';
import { PhoneSnackbar } from './os/snackbar/components/PhoneSnackbar';
import PhoneWrapper from './PhoneWrapper';
import { useAppBankService } from './services/app/useAppBankService';
import { useAppNotesService } from './services/app/useAppNotesService';
import { useAppSocietyService } from './services/app/useAppSocietyService';
import { useAppTwitchNewsService } from './services/app/useAppTwitchNewsService';
import { useTimeService } from './services/os/useTimeService';
import { useVisibilityService } from './services/os/useVisibilityService';
import { useCallService } from './services/useCallService';
import { useContactService } from './services/useContactService';
import { useDebugService } from './services/useDebugService';
import { useEmergencyService } from './services/useEmergencyService';
import { useKeyboardService } from './services/useKeyboardService';
import { useMessagesService } from './services/useMessagesService';
import { usePhoneService } from './services/usePhoneService';
import { usePhotoService } from './services/usePhotoService';
import { useSimCardService } from './services/useSimCardService';

function Phone() {
    const { apps } = useApps();
    const config = useConfig();
    const callModal = useCallModal();
    const emergency = useEmergency();

    useDebugService();

    // Core services
    usePhoneService();
    useTimeService();
    useVisibilityService();

    // System services
    useKeyboardService();
    useSimCardService();
    useCallService();
    useContactService();
    useMessagesService();
    usePhotoService();
    useEmergencyService();

    // Apps services
    useAppBankService();
    useAppNotesService();
    useAppTwitchNewsService();
    useAppSocietyService();

    if (config.wallpaper === undefined) {
        return null;
    }

    return (
        <PhoneWrapper>
            <NotificationAlert />
            <PhoneSnackbar />
            <Routes>
                <Route path="/" element={<HomeApp />} />
                {callModal && <Route path="/call" element={<CallModal />} />}
                {emergency && <Route path="/emergency" element={<EmergencyModal />} />}
                {apps.map(app => (
                    <Route key={app.id} path={app.path + '/*'} element={app.component} />
                ))}
            </Routes>
        </PhoneWrapper>
    );
}

export default Phone;
