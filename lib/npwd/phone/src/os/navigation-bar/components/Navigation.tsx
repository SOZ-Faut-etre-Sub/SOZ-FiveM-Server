import React from 'react';
import { BottomNavigation } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { usePhone } from '@os/phone/hooks/usePhone';
import { useNotifications } from '@os/notifications/hooks/useNotifications';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 2,
    height: '15px',
    backgroundColor: 'transparent',
  },
}));

const style = {
  home: {
    backgroundColor: 'rgba(255, 255, 255, .65)',
    height: '6px',
    width: '35%',
    borderRadius: '10px',
    cursor: 'pointer'
  }
}

export const Navigation = () => {
  const classes = useStyles();
  const history = useHistory();
  const { setBarUncollapsed } = useNotifications();
  return (
    <BottomNavigation
      className={classes.root}
      onChange={(_e, value) => {
        setBarUncollapsed(false);
        value();
      }}
    >
      <div style={style.home} onClick={() => history.push('/')} />
    </BottomNavigation>
  );
};
