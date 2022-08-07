import { ChevronRightIcon } from '@heroicons/react/outline';
import { Button } from '@ui/old_components/Button';
import React from 'react';

import { INotification } from '../providers/NotificationsProvider';

export const NotificationItem = ({
    onClose,
    onClickClose,
    ...notification
}: INotification & {
    onClose: (e: any) => void;
    onClickClose: (e: any) => void;
}) => {
    const { title, notificationIcon: NotificationIcon, content, cantClose, onClick } = notification;

    const isImage = url => {
        return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
    };

    return (
        <li
            className={`cursor-pointer py-2 px-4 flex justify-between items-center hover:bg-black hover:bg-opacity-25 text-white text-sm`}
            onClick={e => {
                if (onClick) {
                    onClick(notification);
                    onClickClose(e);
                }
            }}
        >
            {NotificationIcon && (
                <div className={`text-white h-5 w-5 p-1 rounded-md`}>
                    <NotificationIcon />
                </div>
            )}
            <div className="flex flex-col">
                <p className="flex-grow ml-4 font-light normal-case">{title}</p>
                <p className="flex-grow ml-4 font-light normal-case">
                    {isImage(content) ? 'Vous avez reçu une image' : content}
                </p>
            </div>
            {!cantClose && (
                <Button className="mx-2" onClick={onClose}>
                    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                </Button>
            )}
        </li>
    );
};
