import { ListItem } from '@ui/components/ListItem';
import React from 'react';
import {INotification} from '../providers/NotificationsProvider';

export const NotificationItem = ({
    onClose,
    onClickClose,
    ...notification
}: INotification & {
    onClose: (e: any) => void;
    onClickClose: (e: any) => void;
}) => {
    const {title, icon, content, cantClose, onClick} = notification;

    return (
        <ListItem
            onClick={(e) => {
                if (onClick) {
                    onClick(notification);
                    onClickClose(e);
                }
            }}

        >
            {/*{icon && <ListItemAvatar >{icon}</ListItemAvatar>}*/}
            {/*<ListItemText secondary={content}>{title}</ListItemText>*/}
            {/*{!cantClose && (*/}
            {/*    <IconButton  size="small" onClick={onClose}>*/}
            {/*        <CloseIcon color="primary"/>*/}
            {/*    </IconButton>*/}
            {/*)}*/}
        </ListItem>
    );
};
