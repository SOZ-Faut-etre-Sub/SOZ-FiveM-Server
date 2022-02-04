import React, {useEffect} from 'react';
import {useNotifications} from '../hooks/useNotifications';
import {NotificationItem} from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import {NoNotificationText} from './NoNotificationText';
import BatteryIcon from "../../../styles/icons/system/Battery";
import CellSignal from "../../../styles/icons/system/CellSignal";
import { List } from '@ui/components/List';
import {useRouteMatch} from "react-router-dom";


export const NotificationBar = () => {
    const {icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed} =
        useNotifications();

    const {isExact} = useRouteMatch('/');
    const time = usePhoneTime();

    useEffect(() => {
        if (notifications.length === 0) {
            setBarUncollapsed(false);
        }
    }, [notifications, setBarUncollapsed]);

    return (
        <>
            <div className={`${!isExact && 'bg-black'} grid grid-cols-3 px-5 py-3 text-white text-sm w-full z-50`}>
                <div className="text-center">
                    {time}
                    {icons.map((notifIcon) => (
                        <div >
                            {notifIcon.icon}
                        </div>
                    ))}
                </div>
                <div>&nbsp;</div>
                <div className="flex justify-end">
                    <span>ZT&T</span>
                    <CellSignal className="h-5 w-5 mx-2"/>
                    <BatteryIcon className="h-5 w-5"/>
                </div>
            </div>


            {/*<div onClick={() => {*/}
            {/*        setBarUncollapsed((curr) => !curr);*/}
            {/*    }}*/}
            {/*>*/}
            {/*</div>*/}
            {/*<div >*/}
            {/*    <div >*/}
            {/*        <div>*/}
            {/*            <List>*/}
            {/*                {notifications.map((notification, idx) => (*/}
            {/*                    <NotificationItem*/}
            {/*                        key={idx}*/}
            {/*                        {...notification}*/}
            {/*                        onClose={(e) => {*/}
            {/*                            e.stopPropagation();*/}
            {/*                            notification.onClose?.(notification);*/}
            {/*                            removeNotification(idx);*/}
            {/*                        }}*/}
            {/*                        onClickClose={() => {*/}
            {/*                            setBarUncollapsed(false);*/}
            {/*                            if (!notification.cantClose) {*/}
            {/*                                removeNotification(idx);*/}
            {/*                            }*/}
            {/*                        }}*/}
            {/*                    />*/}
            {/*                ))}*/}
            {/*            </List>*/}
            {/*        </div>*/}
            {/*        {!notifications.length && <NoNotificationText/>}*/}
            {/*        <div >*/}
            {/*            /!*<IconButton*!/*/}
            {/*            /!*    *!/*/}
            {/*            /!*    size="small"*!/*/}
            {/*            /!*    onClick={() => setBarUncollapsed(false)}*!/*/}
            {/*            /!*>*!/*/}
            {/*            /!*    <ArrowDropUpIcon/>*!/*/}
            {/*            /!*</IconButton>*!/*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    );
};
