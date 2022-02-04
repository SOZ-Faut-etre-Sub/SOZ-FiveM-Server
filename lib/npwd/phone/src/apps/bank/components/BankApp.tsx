import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppContent} from '@ui/components/AppContent';
import './BankApp.css';

import {Switch, Route} from 'react-router-dom';
import {BankHome} from './home/BankHome';
import {Transition} from '@headlessui/react';
import {AppTitle} from "@ui/components/AppTitle";
import {useTranslation} from "react-i18next";

export const BankApp = () => {
    const [t] = useTranslation();

    return (
        <Transition
            appear={true}
            show={true}
            className="mt-4 h-full flex flex-col"
            enter="transition-all origin-[80%_10%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[80%_10%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <AppTitle title={t('APPS_BANK')} isBigHeader={true}/>
                <AppContent>
                    <Switch>
                        <Route path="/bank" exact component={BankHome}/>
                        {/*<Route path="/bank/account" exact component={BankAccount} />*/}
                    </Switch>
                </AppContent>
                {/*<NavigationBar />*/}
            </AppWrapper>
        </Transition>
    );
};
