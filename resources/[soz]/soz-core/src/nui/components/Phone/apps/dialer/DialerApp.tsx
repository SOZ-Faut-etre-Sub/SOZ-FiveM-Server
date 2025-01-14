import { ClockIcon, UserCircleIcon, ViewGridIcon } from '@heroicons/react/solid';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { ContactList } from '../contacts/components/ContactList';
import { DialerHistory } from './pages/DialerHistory';
import { DialerKeyboard } from './pages/DialerKeyboard';

export const DialerApp: FunctionComponent = () => {
    const { t } = useTranslation();

    return (
        <AppContainer
            tabBarOptions={[
                {
                    label: t('DIALER.NAVBAR_HISTORY'),
                    path: '/phone',
                    icon: ClockIcon,
                },
                {
                    label: t('DIALER.NAVBAR_CONTACTS'),
                    path: '/phone/contacts',
                    icon: UserCircleIcon,
                },
                {
                    label: t('DIALER.NAVBAR_DIAL'),
                    path: '/phone/keyboard',
                    icon: ViewGridIcon,
                },
            ]}
        >
            <Routes>
                <Route index element={<DialerHistory />} />
                <Route path="/contacts" element={<ContactList isEmbeded />} />
                <Route path="/keyboard" element={<DialerKeyboard />} />
            </Routes>
        </AppContainer>
    );
};
