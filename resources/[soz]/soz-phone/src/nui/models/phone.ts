import { createModel } from '@rematch/core';

import { ServerPromiseResp } from '../../../typings/common';
import { PhoneEvents } from '../../../typings/phone';
import { IPhoneSettings } from '../apps/settings/hooks/useSettings';
import config from '../config/default.json';
import { fetchNui } from '../utils/fetchNui';
import { buildRespObj } from '../utils/misc';
import { RootModel } from '.';

export const phone = createModel<RootModel>()({
    state: {
        available: true,
        config: config.defaultSettings as IPhoneSettings,
        callModal: false,
        citizenID: null,
    },
    reducers: {
        SET_AVAILABILITY(state, payload: boolean) {
            return { ...state, available: payload };
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
            let phoneConfig = config.defaultSettings;
            const saved = localStorage.getItem('soz_settings');
            if (saved) {
                phoneConfig = { ...phoneConfig, ...JSON.parse(saved) };
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
