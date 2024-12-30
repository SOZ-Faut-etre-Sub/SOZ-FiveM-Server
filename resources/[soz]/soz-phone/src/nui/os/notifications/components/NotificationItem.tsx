import React from 'react';

import { isImage } from '../../../common/utils/image';
import { INotification } from '../providers/NotificationsProvider';

export const NotificationItem = ({
    onClickClose,
    ...notification
}: INotification & {
    onClickClose?: (e: any) => void;
}) => {
    const { title, notificationIcon: NotificationIcon, content, onClick } = notification;

    return (
        <li
            className={`cursor-pointer py-2 px-4 flex items-center bg-ios-800 hover:bg-opacity-80 text-white rounded-[20px] text-sm`}
            onClick={e => {
                if (onClick) {
                    onClick(notification);
                    onClickClose?.(e);
                }
            }}
        >
            {NotificationIcon && <NotificationIcon className="text-white size-12 p-1 rounded-xl shrink-0" />}
            <div className="flex flex-col grow">
                <p className="ml-4 font-light normal-case">{title}</p>
                <p className="ml-4 font-light normal-case">{isImage(content) ? 'Vous avez reçu une image' : content}</p>
            </div>
        </li>
    );
};
