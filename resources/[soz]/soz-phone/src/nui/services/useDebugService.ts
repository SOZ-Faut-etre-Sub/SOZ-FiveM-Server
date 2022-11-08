import dayjs from 'dayjs';
import { useEffect } from 'react';

import { PhoneEvents } from '../../../typings/phone';
import { SettingsEvents } from '../../../typings/settings';
import InjectDebugData from '../os/debug/InjectDebugData';

export const useDebugService = () => {
    useEffect(() => {
        InjectDebugData<any>([
            {
                app: 'PHONE',
                method: PhoneEvents.SET_VISIBILITY,
                data: true,
            },
            {
                app: 'PHONE',
                method: PhoneEvents.SET_PHONE_READY,
                data: true,
            },
            {
                app: 'PHONE',
                method: PhoneEvents.SET_TIME,
                data: dayjs().format('hh:mm'),
            },
            {
                app: 'SIMCARD',
                method: PhoneEvents.SET_NUMBER,
                data: '111-1134',
            },
            {
                app: 'SOCIETY_SIMCARD',
                method: PhoneEvents.SET_SOCIETY_NUMBER,
                data: '555-LSPD',
            },
            {
                app: 'AVATAR',
                method: SettingsEvents.SET_AVATAR,
                data: 'https://beta.iodine.gg/teUcY.jpeg',
            },
            /*{
                app: 'CALL',
                method: CallEvents.SET_CALLER,
                data: {
                    is_accepted: true,
                    isTransmitter: true,
                    transmitter: '603-275-8373',
                    receiver: '603-275-4747',
                    active: true,
                },
            },
            {
                app: 'CALL',
                method: CallEvents.SET_CALL_MODAL,
                data: true,
            },*/
        ]);
    }, []);
};
