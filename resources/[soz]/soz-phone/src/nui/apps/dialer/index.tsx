import { Transition } from '@headlessui/react';
import { ClockIcon, UserCircleIcon, ViewGridIcon } from '@heroicons/react/solid';
import { useApp } from '@os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';

import { useCallModal } from '../../hooks/usePhone';
import { CallModal } from '../../os/call/components/CallModal';
import { NavBarButton, NavBarContainer } from '../../ui/components/NavBar';
import { useBackground } from '../../ui/hooks/useBackground';
import { ContactList } from '../contacts/pages/ContactList';
import { DialerHistory } from './pages/DialerHistory';
import DialerKeyboard from './pages/DialerKeyboard';

export const DialerApp: React.FC = () => {
    const dialer = useApp('dialer');
    const { pathname } = useLocation();
    const [t] = useTranslation();
    const backgroundClass = useBackground();

    const callModal = useCallModal();

    if (callModal) {
        return <CallModal />;
    }

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[20%_90%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[20%_90%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <AppTitle app={dialer} />
                    <AppContent scrollable={false} className="pb-20">
                        <Routes>
                            <Route index element={<DialerHistory />} />
                            <Route path="contacts" element={<ContactList skipTitle />} />
                            <Route path="dial" element={<DialerKeyboard />} />
                        </Routes>
                    </AppContent>

                    <NavBarContainer>
                        <NavBarButton active={pathname === '/phone'} path={'/phone'}>
                            <ClockIcon className="w-5 h-5" /> {t('DIALER.NAVBAR_HISTORY')}
                        </NavBarButton>
                        <NavBarButton active={pathname === '/phone/contacts'} path={'/phone/contacts'}>
                            <UserCircleIcon className="w-5 h-5" /> {t('DIALER.NAVBAR_CONTACTS')}
                        </NavBarButton>
                        <NavBarButton active={pathname === '/phone/dial'} path={'/phone/dial'}>
                            <ViewGridIcon className="w-5 h-5" /> {t('DIALER.NAVBAR_DIAL')}
                        </NavBarButton>
                    </NavBarContainer>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
