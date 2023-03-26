import { createModel } from '@rematch/core';

import { RootModel } from '.';

export const emergency = createModel<RootModel>()({
    state: {
        lsmcCalled: false,
        emergency: false,
        dead: false,
        emergencyStart: 0,
    },
    reducers: {
        SET_LSMC_CALLED(state, payload: boolean) {
            return { ...state, lsmcCalled: payload };
        },
        SET_EMERGENCY(state, payload: boolean) {
            if (payload && !state.emergency) {
                return { ...state, emergencyStart: Date.now(), emergency: payload };
            } else {
                return { ...state, lsmcCalled: false, emergency: payload };
            }
        },
        SET_DEAD(state, payload: boolean) {
            return { ...state, dead: payload };
        },
    },
    effects: dispatch => ({
        async setLSMCCalled(payload: boolean) {
            dispatch.emergency.SET_LSMC_CALLED(payload);
        },
        async setEmergency(payload: boolean) {
            dispatch.emergency.SET_EMERGENCY(payload);
        },
        async setDead(payload: boolean) {
            dispatch.emergency.SET_DEAD(payload);
        },
    }),
});
