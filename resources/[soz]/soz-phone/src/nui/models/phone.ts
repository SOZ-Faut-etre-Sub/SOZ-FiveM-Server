import { createModel } from '@rematch/core';

import { ServerPromiseResp } from '../../../typings/common';
import { PhoneEvents } from '../../../typings/phone';
import { IPhoneSettings } from '../apps/settings/hooks/useSettings';
import { fetchNui } from '../common/utils/fetchNui';
import { buildRespObj } from '../common/utils/misc';
import config from '../config/default.json';
import { RootModel } from '.';

export const phone = createModel<RootModel>()({
    state: {
        available: true,
        darkweb: true,
        config: config.defaultSettings as IPhoneSettings,
        callModal: false,
        citizenID: null,
    },
    reducers: {
        SET_AVAILABILITY(state, payload: boolean) {
            return { ...state, available: payload };
        },
        SET_DARKWEB(state, payload: boolean) {
            return { ...state, darkweb: payload };
        },
        SET_CONFIG(state, payload: IPhoneSettings) {
            return { ...state, config: payload };
        },
        SET_CALL_MODAL(state, payload: boolean) {
            return { ...state, callModal: payload };
        },
        SET_CITIZEN_ID(state, payload: string) {
            return { ...state, citizenID: payload };
        },
    },
    effects: dispatch => ({
        async setAvailability(payload: boolean) {
            dispatch.phone.SET_AVAILABILITY(payload);
        },
        async setDarkweb(payload: boolean) {
            dispatch.phone.SET_DARKWEB(payload);
        },
        async setConfig(payload: IPhoneSettings) {
            dispatch.phone.SET_CONFIG(payload);
        },
        async updateConfig(payload: IPhoneSettings) {
            localStorage.setItem('soz_settings', JSON.stringify(payload));
            dispatch.phone.SET_CONFIG(payload);
        },
        async setCallModal(payload: boolean) {
            dispatch.phone.SET_CALL_MODAL(payload);
        },
        // loader
        async loadConfig() {
            const phoneConfig = config.defaultSettings;

            const saved = localStorage.getItem('soz_settings');
            if (saved) {
                const parsedConfig = JSON.parse(saved);

                for (const key in parsedConfig) {
                    const configValues = config[`${key}s`];
                    if (Array.isArray(configValues)) {
                        const valueExists = configValues.find(v => v.value === parsedConfig[key].value);
                        if (valueExists) {
                            phoneConfig[key] = valueExists;
                        }
                    } else {
                        phoneConfig[key] = parsedConfig[key];
                    }
                }
            }

            dispatch.phone.SET_CONFIG(phoneConfig);
        },
        async loadCitizenID() {
            fetchNui<ServerPromiseResp<string>>(PhoneEvents.SET_CITIZEN_ID, undefined, buildRespObj('1'))
                .then(citizenid => {
                    dispatch.phone.SET_CITIZEN_ID(citizenid.data || '');
                })
                .catch(() => console.error('Failed to fetch citizenid'));
        },
    }),
});
