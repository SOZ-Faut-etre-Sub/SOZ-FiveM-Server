import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {IconButton, ListItem, ListItemAvatar, ListItemText, Theme} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {INotification} from '../providers/NotificationsProvider';

const useStyles = makeStyles<Theme, { cantClose: boolean }>((theme) => ({
    closeNotifBtn: {
        position: 'absolute',
        right: '8px',
        top: '8px',
    },
    notificationItem: {
        paddingRight: ({cantClose}) => (cantClose ? '8px' : '28px'),
        background: 'rgba(255, 255, 255, .1)',
        position: 'relative',
        color: 'white',
        width: '90%',
        margin: 'auto',
        borderRadius: '.8rem',
        marginBottom: '1rem'
    },
    iconItem: {
        '& *': {
            borderRadius: '.8rem',
            maxHeight: '40px',
            maxWidth: '40px',
        }
    }
}));

export const NotificationItem = ({
    onClose,
    onClickClose,
    ...notification
}: INotification & {
    onClose: (e: any) => void;
    onClickClose: (e: any) => void;
}) => {
    const {title, icon, content, cantClose, onClick} = notification;
    const classes = useStyles({cantClose});

    return (
        <ListItem
            button
            onClick={(e) => {
                if (onClick) {
                    onClick(notification);
                    onClickClose(e);
                }
            }}
            className={classes.notificationItem}
        >
            {icon && <ListItemAvatar className={classes.iconItem}>{icon}</ListItemAvatar>}
            <ListItemText secondary={content}>{title}</ListItemText>
            {!cantClose && (
                <IconButton className={classes.closeNotifBtn} size="small" onClick={onClose}>
                    <CloseIcon color="primary"/>
                </IconButton>
            )}
        </ListItem>
    );
};
