import { CreditCardIcon, DocumentTextIcon, SwitchVerticalIcon } from '@heroicons/react/solid';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { BankHome } from './pages/BankHome';
import { HistoryList } from './pages/HistoryList';
import { InvoiceList } from './pages/InvoiceList';

export const BankApp: FunctionComponent = () => {
    const { t } = useTranslation();

    return (
        <AppContainer
            tabBarOptions={[
                {
                    label: t('BANK.NAVBAR_DASHBOARD'),
                    path: '/bank',
                    icon: CreditCardIcon,
                },
                {
                    label: t('BANK.NAVBAR_HISTORY'),
                    path: '/bank/history',
                    icon: SwitchVerticalIcon,
                },
                {
                    label: t('BANK.NAVBAR_INVOICES'),
                    path: '/bank/invoices',
                    icon: DocumentTextIcon,
                },
            ]}
        >
            <Routes>
                <Route index element={<BankHome />} />
                <Route path="/history" element={<HistoryList />} />
                <Route path="/invoices" element={<InvoiceList />} />
            </Routes>
        </AppContainer>
    );
};
