import React from 'react';
import { useCredentials } from '../../hooks/useCredentials';
import {BankCard} from "../account/BankCard";

export const BankHome = () => {
  const credentials = useCredentials();

  if (!credentials) return <div>Could not load credentials</div>;

  return (
    <div >
      <div >
        <BankCard name={credentials.name} account="Checking" balance={credentials.balance} />
      </div>
    </div>
  );
};
