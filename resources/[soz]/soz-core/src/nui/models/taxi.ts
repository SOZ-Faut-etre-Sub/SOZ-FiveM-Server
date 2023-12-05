import { TaxiStatus } from '@public/shared/job/cjr';
import { createModel } from '@rematch/core';

import type { RootModel } from './';

export const taxi = createModel<RootModel>()({
    state: {
        horodateurStarted: false,
        horodateurDisplayed: false,
        missionInprogress: false,
    } as TaxiStatus,
    reducers: {
        update(state, taxi: Partial<TaxiStatus>) {
            return { ...state, ...taxi };
        },
        toogleDisplay(state) {
            return { horodateurDisplayed: !state.horodateurDisplayed, ...state };
        },
        toogleStart(state) {
            return { horodateurStarted: !state.horodateurStarted, ...state };
        },
    },
    effects: dispatch => ({
        async closeHorodateur() {
            dispatch.taxi.update({ horodateurDisplayed: false });
        },
        async toogleHorodateurDisplay() {
            dispatch.taxi.toogleDisplay();
        },
        async toogleHorodateurStart() {
            dispatch.taxi.toogleStart();
        },
    }),
});
