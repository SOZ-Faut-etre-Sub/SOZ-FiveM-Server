import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../../hooks/useTransactions';

export const TransactionList = () => {
  const transactionList = useTransactions();
  const [t] = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const TransactionTypes = {
    // Deposit: classes.depositType,
    // Withdraw: classes.withdrawType,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div id="transaction-section">
      <div >
        <h2 >{t('APPS_BANK_ACCOUNT_TRANSACTIONS')}</h2>
      </div>

      <div >
        {transactionList
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((transaction: any) => (
            <div >
              <div>
                <h1 >{transaction.source}</h1>
                <p >{transaction.type}</p>
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
