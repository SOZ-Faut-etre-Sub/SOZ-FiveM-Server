import React from 'react';
import { BankTitle } from './BankTitle';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import './BankApp.css';

import { Switch, Route } from 'react-router-dom';
import { NavigationBar } from './navigation/NavigationBar';

import { BankHome } from './home/BankHome';
import { BankAccount } from './account/BankAccount';

export const BankApp = () => {
  return (
    <AppWrapper id="bank-app">
      <BankTitle />
      <AppContent>
        <Switch>
          <Route path="/bank" exact component={BankHome} />
          {/*<Route path="/bank/account" exact component={BankAccount} />*/}
        </Switch>
      </AppContent>
      {/*<NavigationBar />*/}
    </AppWrapper>
  );
};
