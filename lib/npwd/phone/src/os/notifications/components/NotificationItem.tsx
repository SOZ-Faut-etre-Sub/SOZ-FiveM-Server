import React from 'react';
import {INotification} from '../providers/NotificationsProvider';
import {ChevronRightIcon} from "@heroicons/react/outline";
import {Button} from "@ui/components/Button";

export const NotificationItem = ({
    onClose,
    onClickClose,
    ...notification
}: INotification & {
    onClose: (e: any) => void;
    onClickClose: (e: any) => void;
}) => {
    const {title, notificationIcon, content, cantClose, onClick} = notification;

    return (
        <li
            className={`cursor-pointer py-2 px-4 flex justify-between items-center hover:bg-black hover:bg-opacity-25 text-white text-sm`}
            onClick={(e) => {
                if (onClick) {
                    onClick(notification);
                    onClickClose(e);
                }
            }}

        >
            {notificationIcon && <div className={`text-white h-8 w-8 p-1 rounded-md`}>{notificationIcon}</div>}
            <div className="flex flex-col">
                <p className="flex-grow ml-4 font-light normal-case">{title}</p>
                <p className="flex-grow ml-4 font-light normal-case">{content}</p>
            </div>
            {!cantClose && (
                <Button className="mx-2" onClick={onClose}>
                    <ChevronRightIcon className="h-4 w-4 text-gray-400"/>
                </Button>
            )}
        </li>
    );
};
