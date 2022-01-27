import React, { useEffect } from 'react';
import { Typography, Grid, IconButton, Slide, Paper, Box, List, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import BatteryIcon from "../../../styles/icons/system/Battery";
import CellSignal from "../../../styles/icons/system/CellSignal";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '33px',
    width: '100%',
    color: theme.palette.text.primary,
    zIndex: 99,
    paddingTop: '13px',
    alignItems: 'center',
    position: 'relative',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  item: {
    margin: '0 2px',
  },
  text: {
    position: 'relative',
    lineHeight: '0.85rem',
    fontWeight: 300,
    fontSize: '0.85rem',
    color: theme.palette.text.primary,
  },
  icon: {
    paddingLeft: '6px',
    color: theme.palette.text.primary,
  },
  drawer: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    position: 'absolute',
    top: '30px',
    zIndex: 98,
  },
  closeNotifBtn: {
    position: 'absolute',
    right: '8px',
    top: '8px',
  },
  notificationItem: {
    position: 'relative',
  },
  collapseBtn: {
    margin: '0 auto',
  },
}));

export const NotificationBar = () => {
  const classes = useStyles();

  const { icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed } =
    useNotifications();

  const time = usePhoneTime();

  useEffect(() => {
    if (notifications.length === 0) {
      setBarUncollapsed(false);
    }
  }, [notifications, setBarUncollapsed]);

  return (
    <>
      <Grid
        className={classes.root}
        container
        justifyContent="space-between"
        wrap="nowrap"
        onClick={() => {
          setBarUncollapsed((curr) => !curr);
        }}
      >
        <Grid container item wrap="nowrap" justifyContent="center">
            {time && (
              <Grid item className={classes.item}>
                <Typography className={classes.text} variant="inherit">
                  {time}
                </Typography>
              </Grid>
            )}
          {icons.map((notifIcon) => (
            <Grid item key={notifIcon.key} component={IconButton} className={classes.icon}>
              {notifIcon.icon}
            </Grid>
          ))}
        </Grid>
        <Grid container item wrap="nowrap" />
        <Grid container item wrap="nowrap" justifyContent="center" alignItems="center">
          <Grid item className={classes.icon}>
              <Typography className={classes.text} variant="inherit">
                  5Z <CellSignal/>
              </Typography>
          </Grid>
          <Grid item className={classes.icon}>
              <BatteryIcon />
          </Grid>
        </Grid>
      </Grid>
      <Slide direction="down" in={barUncollapsed} mountOnEnter unmountOnExit>
        <Paper square className={classes.drawer}>
          <Box py={1}>
            <List>
              <Divider />
              {notifications.map((notification, idx) => (
                <NotificationItem
                  key={idx}
                  {...notification}
                  onClose={(e) => {
                    e.stopPropagation();
                    notification.onClose?.(notification);
                    removeNotification(idx);
                  }}
                  onClickClose={() => {
                    setBarUncollapsed(false);
                    if (!notification.cantClose) {
                      removeNotification(idx);
                    }
                  }}
                />
              ))}
            </List>
          </Box>
          <Box display="flex" flexDirection="column">
            {!notifications.length && <NoNotificationText />}
            <IconButton
              className={classes.collapseBtn}
              size="small"
              onClick={() => setBarUncollapsed(false)}
            >
              <ArrowDropUpIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};
