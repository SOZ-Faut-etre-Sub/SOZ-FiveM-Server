import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTransactions } from '../../hooks/useTransactions';

export const TransactionList = () => {
    const transactionList = useTransactions();
    const [t] = useTranslation();
    const [page] = useState(0);
    const [rowsPerPage] = useState(5);

    const TransactionTypes = {
        // Deposit: classes.depositType,
        // Withdraw: classes.withdrawType,
    };

    return (
        <div id="transaction-section">
            <div>
                <h2>{t('APPS_BANK_ACCOUNT_TRANSACTIONS')}</h2>
            </div>

            <div>
                {transactionList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction: any) => (
                    <div>
                        <div>
                            <h1>{transaction.source}</h1>
                            <p>{transaction.type}</p>
                        </div>
                        <div>
                            <p className={TransactionTypes[transaction.type]}>
                                {transaction.type === 'Withdraw' ? '-' : '+'}
                                {transaction.amount}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
