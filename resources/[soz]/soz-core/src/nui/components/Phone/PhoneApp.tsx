import './system/locale/i18n';

import { FunctionComponent } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { Control } from '../../../shared/input';
import { useNuiFocus } from '../../hook/nui';
import { useAppBankStateHandlers } from './apps/bank/bank.atom';
import { useAppDarkWebStateHandlers } from './apps/darkweb/darkweb.atom';
import { CallModalApp } from './apps/dialer/CallModalApp';
import { HomeApp } from './apps/home/HomeApp';
import { useAppNewsStateHandlers } from './apps/news/news.atom';
import { useAppNotesStateHandlers } from './apps/notes/notes.atom';
import { useAppPhotosStateHandlers } from './apps/photos/photos.atom';
import { useSocietyMessagesStateHandlers } from './apps/society-messages/messages.atom';
import { useAppWeatherStateHandlers } from './apps/weather/weather.atom';
import { useKeyboard } from './hooks/useKeyboard';
import { ActionSheet } from './system/action-sheet/components/ActionSheet';
import { Alerts } from './system/alerts/components/Alerts';
import { useApps } from './system/apps/hooks/useApps';
import { CallButtonDynamicIsland } from './system/dynamic-island/components/CallButtonDynamicIsland';
import { CallDynamicIsland } from './system/dynamic-island/components/CallDynamicIsland';
import { useEmergency, useEmergencyStateHandlers } from './system/emergency/emergency.atom';
import { EmergencyApp } from './system/emergency/EmergencyApp';
import { NotificationAlert } from './system/notifications/components/NotificationAlert';
import { usePhoneFocus, usePhoneInsideInput, usePhoneStateHandlers } from './system/phone.atom';
import { PhoneWrapper } from './system/PhoneWrapper';
import { useSimCardStateHandlers } from './system/sim-card/sim.card.atom';
import { SoundProvider } from './system/sound/providers/SoundProvider';

export const PhoneApp: FunctionComponent = () => {
    const apps = useApps();
    const focus = usePhoneFocus();
    const insideInput = usePhoneInsideInput();

    const emergency = useEmergency();

    useNuiFocus(
        focus,
        focus,
        insideInput ? false : focus,
        focus
            ? [
                  Control.VehicleNextRadio,
                  Control.Attack,
                  Control.Attack2,
                  Control.Aim,
                  Control.Reload,
                  Control.MeleeAttack1,
                  Control.MeleeAttack2,
                  Control.MeleeAttackLight,
                  Control.MeleeAttackHeavy,
              ]
            : null
    );

    return (
        <div className="absolute h-full w-full">
            <SoundProvider>
                <MemoryRouter>
                    <PhoneAppHooks />

                    <PhoneWrapper>
                        <Alerts />
                        <ActionSheet />
                        <CallDynamicIsland />
                        <CallButtonDynamicIsland />
                        <NotificationAlert />

                        {emergency ? (
                            <EmergencyApp />
                        ) : (
                            <Routes>
                                <Route index element={<HomeApp />} />
                                <Route path="/call" element={<CallModalApp />} />

                                {apps.map(app => (
                                    <Route key={app.id} path={app.path + '/*'} element={app.component} />
                                ))}
                            </Routes>
                        )}
                    </PhoneWrapper>
                </MemoryRouter>
            </SoundProvider>
        </div>
    );
};

const PhoneAppHooks: FunctionComponent = () => {
    useKeyboard();

    usePhoneStateHandlers();
    useSimCardStateHandlers();

    // System Apps
    useEmergencyStateHandlers();
    useAppPhotosStateHandlers();

    // Apps
    useAppBankStateHandlers();
    useAppDarkWebStateHandlers();
    useAppNewsStateHandlers();
    useAppNotesStateHandlers();
    useAppWeatherStateHandlers();
    useSocietyMessagesStateHandlers();

    return null;
};
