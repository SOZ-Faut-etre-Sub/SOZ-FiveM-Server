import dayjs from 'dayjs';
import { useEffect } from 'react';

import DefaultConfig from '../../../config.json';
import { BankEvents } from '../../../typings/app/bank';
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
                app: 'PHONE',
                method: PhoneEvents.SET_CONFIG,
                data: DefaultConfig,
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
            {
                app: 'BANK',
                method: BankEvents.SEND_CREDENTIALS,
                data: {
                    name: 'John Doe',
                    account: '555Z5555T555',
                    balance: 1258745,
                },
            },
        ]);
    }, []);
};
