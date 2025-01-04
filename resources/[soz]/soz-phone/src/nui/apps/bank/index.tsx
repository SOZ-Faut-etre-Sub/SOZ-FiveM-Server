import { Transition } from '@headlessui/react';
import { CreditCardIcon, DocumentTextIcon, SwitchVerticalIcon } from '@heroicons/react/solid';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import cn from 'classnames';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { NavBarButton, NavBarContainer } from '../../ui/components/NavBar';
import { useBackground } from '../../ui/hooks/useBackground';
import { FullPageWithHeader } from '../../ui/layout/FullPageWithHeader';
import { BankHome } from '../../../../../soz-core/src/nui/components/Phone/apps/bank/pages/BankHome';
import HistoryList from '../../../../../soz-core/src/nui/components/Phone/apps/bank/pages/HistoryList';
import InvoiceList from '../../../../../soz-core/src/nui/components/Phone/apps/bank/pages/InvoiceList';

export const BankApp = memo(() => {
    const [t] = useTranslation();
    const backgroundClass = useBackground();
    const { pathname } = useLocation();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-center duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-center duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    {pathname !== '/bank' && <AppTitle title={t('APPS_BANK')} isBigHeader />}

                    <AppContent
                        scrollable={false}
                        className={cn('pb-20', {
                            'h-[805px]': pathname === '/bank',
                        })}
                    >
                        <Routes>
                            <Route index element={<BankHome />} />
                            <Route path="/history" element={<HistoryList />} />
                            <Route path="/invoices" element={<InvoiceList />} />
                        </Routes>
                    </AppContent>

                    <NavBarContainer hasBigHeader={pathname !== '/bank'} hasNoTitle={pathname === '/bank'}>
                        <NavBarButton active={pathname === '/bank'} path={'/bank'}>
                            <CreditCardIcon className="w-5 h-5" /> {t('BANK.NAVBAR_DASHBOARD')}
                        </NavBarButton>
                        <NavBarButton active={pathname === '/bank/history'} path={'/bank/history'}>
                            <SwitchVerticalIcon className="w-5 h-5" /> {t('BANK.NAVBAR_HISTORY')}
                        </NavBarButton>
                        <NavBarButton active={pathname === '/bank/invoices'} path={'/bank/invoices'}>
                            <DocumentTextIcon className="w-5 h-5" /> {t('BANK.NAVBAR_INVOICES')}
                        </NavBarButton>
                    </NavBarContainer>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
});
