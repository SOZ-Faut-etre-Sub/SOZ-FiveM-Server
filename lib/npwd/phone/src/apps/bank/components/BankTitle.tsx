import React from 'react';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import './BankApp.css';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '90px',
    width: '100%',
    display: 'flex',
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ffffff',
    color: '#f44336',
  },
}));

export const BankTitle = () => {
  const classes = useStyles();
  const [t] = useTranslation();

  return (
    <Paper className={classes.root} square variant="outlined" elevation={24}>
      <Typography id="bank-title" style={{ margin: 0 }} variant="h4">
          {t('APPS_BANK')}
      </Typography>
    </Paper>
  );
};
