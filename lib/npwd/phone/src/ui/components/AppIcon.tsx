import React from 'react';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { green } from '@mui/material/colors';
import {Avatar, Badge, Button, Typography} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';

const useStyles = makeStyles<Theme, { color: string }>((theme) => ({
  root: {
    padding: 0,
    flexDirection: 'column',
    textTransform: 'initial',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:hover': {
        backgroundColor: 'transparent',
    },
  },
  avatar: {
    backgroundColor: 'transparent',
    color: ({ color }) => color,
    boxShadow: theme.shadows[1],
    width: theme.spacing(8),
    height: theme.spacing(8),
    borderRadius: '15px',
    fontSize: theme.typography.h4.fontSize,
  },
  icon: {
    fontSize: theme.typography.h4.fontSize,
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  label: {
    maxWidth: '90px',
    fontSize: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'white'
  }
}));

export interface AppIconProps {
  id: string;
  nameLocale: string;
  Icon: React.ElementType;
  icon: React.ElementType;
  color: string;
  notification: INotificationIcon;
}

export const AppIcon: React.FC<AppIconProps> = ({
  id,
  nameLocale,
  Icon,
  color,
  icon,
  notification,
}) => {
  const [t] = useTranslation();
  const classes = useStyles({
    color: 'white'
  });

  return (
    <Button className={classes.root}>
      <Badge
        color="error"
        badgeContent={notification?.badge}
        invisible={!notification || notification.badge < 2}
      >
        {Icon ? (
          <Icon className={classes.icon} fontSize="large" />
        ) : (
          <Avatar className={classes.avatar}>{icon || t(nameLocale)}</Avatar>
        )}
      </Badge>
      <Typography variant="inherit" className={classes.label}>{t(nameLocale)}</Typography>
    </Button>
  );
};
