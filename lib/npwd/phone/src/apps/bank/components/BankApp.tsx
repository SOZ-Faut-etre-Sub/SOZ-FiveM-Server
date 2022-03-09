import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppContent} from '@ui/components/AppContent';
import './BankApp.css';
import {Switch, Route} from 'react-router-dom';
import {BankHome} from './home/BankHome';
import {AppTitle} from "@ui/components/AppTitle";
import {useTranslation} from "react-i18next";

export const BankApp = () => {
    const [t] = useTranslation();

    return (
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
    );
};
