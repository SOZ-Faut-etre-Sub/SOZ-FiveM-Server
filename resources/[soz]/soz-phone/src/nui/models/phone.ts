import { createModel } from '@rematch/core';

import { IPhoneSettings } from '../apps/settings/hooks/useSettings';
import config from '../config/default.json';
import { RootModel } from '.';

export const phone = createModel<RootModel>()({
    state: {
        available: false,
        visible: false,
        config: config.defaultSettings as IPhoneSettings,
        time: null,
        callModal: false,
    },
    reducers: {
        SET_AVAILABILITY(state, payload: boolean) {
            return { ...state, available: payload };
        },
        SET_VISIBILITY(state, payload: boolean) {
            return { ...state, visible: payload };
        },
        SET_CONFIG(state, payload: IPhoneSettings) {
            return { ...state, config: payload };
        },
        SET_CALL_MODAL(state, payload: boolean) {
            return { ...state, callModal: payload };
        },
    },
    effects: dispatch => ({
        async setAvailability(payload: boolean) {
            dispatch.phone.SET_AVAILABILITY(payload);
        },
        async setVisibility(payload: boolean) {
            dispatch.phone.SET_VISIBILITY(payload);
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
                phoneConfig = JSON.parse(saved);
            }

            dispatch.phone.SET_CONFIG(phoneConfig);
        },
    }),
});
