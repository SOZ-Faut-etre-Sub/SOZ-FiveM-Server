import React from 'react';

import './BankApp.css';
import {useTranslation} from "react-i18next";


export const BankTitle = () => {
  const [t] = useTranslation();

  return (
    <div>
      <div id="bank-title" style={{ margin: 0 }}>
          {t('APPS_BANK')}
      </div>
    </div>
  );
};
