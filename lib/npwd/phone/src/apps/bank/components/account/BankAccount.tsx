import React from 'react';
import {useTranslation} from 'react-i18next';
import {BankCard} from './BankCard';
import {useCredentials} from '../../hooks/useCredentials';

export const BankAccount = () => {
    const credentials = useCredentials();
    const [t] = useTranslation();

    return (
        <div>
            <div>
                <h1>{t('APPS_BANK_ACCOUNT_TITLE')}</h1>
            </div>
            <BankCard name={credentials.name} account="Checking" balance={credentials.balance}/>
        </div>
    );
};
