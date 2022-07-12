import './css/BankApp.css';

import { Transition } from '@headlessui/react';
import { AppTitle } from '@ui/old_components/AppTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { useBackground } from '../../ui/hooks/useBackground';
import { FullPageWithHeader } from '../../ui/layout/FullPageWithHeader';
import { BankHome } from './pages/BankHome';

export const BankApp = () => {
    const [t] = useTranslation();
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[20%_10%] duration-500"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[20%_10%] duration-500"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <AppTitle title={t('APPS_BANK')} isBigHeader={true} />
                    <Routes>
                        <Route index element={<BankHome />} />
                        {/*<Route path="/bank/account" exact component={BankAccount} />*/}
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
