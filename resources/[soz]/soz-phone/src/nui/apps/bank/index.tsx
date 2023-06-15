import './assets/BankApp.css';

import { Transition } from '@headlessui/react';
import { ClockIcon, CurrencyDollarIcon } from '@heroicons/react/outline';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { NavBarButton, NavBarContainer } from '@ui/components/NavBar';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { useBackground } from '../../ui/hooks/useBackground';
import { FullPageWithHeader } from '../../ui/layout/FullPageWithHeader';
import { BankHome } from './pages/BankHome';
import TransfersList from './pages/TransfersList';

export const BankApp = memo(() => {
    const [t] = useTranslation();
    const { pathname } = useLocation();
    const backgroundClass = useBackground();

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
                    <AppTitle title={t('APPS_BANK')} isBigHeader={false} />
                    <AppContent scrollable={true} className="pb-20">
                        <Routes>
                            <Route index element={<BankHome />} />
                            <Route path="history" element={<TransfersList />} />
                        </Routes>
                    </AppContent>
                    <NavBarContainer>
                        <NavBarButton active={pathname === '/bank'} path={'/bank'}>
                            <CurrencyDollarIcon className="w-5 h-5" /> {t('BANK.NAVBAR_ACCOUNT')}
                        </NavBarButton>
                        <NavBarButton active={pathname === ''} path={''}></NavBarButton>
                        <NavBarButton active={pathname === '/bank/history'} path={'/bank/history'}>
                            <ClockIcon className="w-5 h-5" /> {t('BANK.NAVBAR_HISTORY')}
                        </NavBarButton>
                    </NavBarContainer>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
});
