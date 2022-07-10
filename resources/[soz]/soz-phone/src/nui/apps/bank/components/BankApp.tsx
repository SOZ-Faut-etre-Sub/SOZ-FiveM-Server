import './BankApp.css';

import { Transition } from '@headlessui/react';
import { AppWrapper } from '@ui/old_components';
import { AppContent } from '@ui/old_components/AppContent';
import { AppTitle } from '@ui/old_components/AppTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import { BankHome } from './home/BankHome';

export const BankApp = () => {
    const [t] = useTranslation();

    return (
        <Transition
            appear={true}
            show={true}
            className="mt-4 h-full flex flex-col"
            enter="transition-all origin-[20%_10%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[20%_10%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <AppTitle title={t('APPS_BANK')} isBigHeader={true} />
                <AppContent>
                    <Routes>
                        <Route path="/bank" element={<BankHome />} />
                        {/*<Route path="/bank/account" exact component={BankAccount} />*/}
                    </Routes>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
