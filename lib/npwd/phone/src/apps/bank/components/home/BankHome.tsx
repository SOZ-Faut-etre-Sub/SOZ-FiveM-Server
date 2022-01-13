import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCredentials } from '../../hooks/useCredentials';
import useStyles from './home.styles';

export const BankHome = () => {
  const classes = useStyles();
  const credentials = useCredentials();
  const [t] = useTranslation();

  if (!credentials) return <Typography  align="center">Could not load credentials</Typography>;

  return (
    <div className={classes.root}>
      <Typography className={classes.headTitle}>
        <span style={{ fontWeight: 'bold' }}>{t('BANK.HOME_TITLE')}</span>
        <br/>
        <span>{credentials.name}</span>
      </Typography>
      <div className={classes.accounts}>
        <h2 className={classes.accountsType}>{t('BANK.CHECKING')}</h2>
        <p className={classes.accountBalance}>{credentials.balance}</p>
      </div>
      {/*<div className={classes.actions}>*/}
      {/*  <Button id="actionButton" className={classes.actionButton}>*/}
      {/*    <NavLink to="/bank/account">{t('APPS_BANK_ACCOUNT_LINK')}</NavLink>*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  );
};
