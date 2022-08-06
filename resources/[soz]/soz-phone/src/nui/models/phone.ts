import { createModel } from '@rematch/core';

import { IPhoneSettings } from '../apps/settings/hooks/useSettings';
import { RootModel } from '.';

export const phone = createModel<RootModel>()({
    state: {
        available: true,
        visible: true,
        config: {} as IPhoneSettings,
        time: null,
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
        SET_TIME(state, payload: string) {
            return { ...state, time: payload };
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
        async setTime(payload: string) {
            dispatch.phone.SET_TIME(payload);
        },
    }),
});
