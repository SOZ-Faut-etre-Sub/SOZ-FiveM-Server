import React from 'react';
import { Typography } from '@mui/material';
import { useCredentials } from '../../hooks/useCredentials';
import useStyles from './home.styles';
import {BankCard} from "../account/BankCard";

export const BankHome = () => {
  const classes = useStyles();
  const credentials = useCredentials();

  if (!credentials) return <Typography display="flex" justifyContent="center" align="center" flexDirection="column" height="100%">Could not load credentials</Typography>;

  return (
    <div className={classes.root}>
      <Typography className={classes.headTitle}>
        <BankCard name={credentials.name} account="Checking" balance={credentials.balance} />
      </Typography>
    </div>
  );
};
