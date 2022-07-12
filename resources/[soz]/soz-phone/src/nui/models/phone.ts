import { createModel } from '@rematch/core';

import { IPhoneSettings } from '../apps/settings/hooks/useSettings';
import { RootModel } from '.';

export const phone = createModel<RootModel>()({
    state: {
        visible: true,
        available: true,
        config: {} as IPhoneSettings,
    },
    reducers: {
        setAvailability(state, payload: boolean) {
            return { ...state, available: payload };
        },
        setVisibility(state, payload: boolean) {
            return { ...state, visible: payload };
        },
        setConfig(state, payload: IPhoneSettings) {
            return { ...state, config: payload };
        },
    },
});
