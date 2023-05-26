import { createModel } from '@rematch/core';

import { Ear, Radio, RadioChannel } from '../../../shared/voip';
import type { RootModel } from './';

export const radioShortRange = createModel<RootModel>()({
    state: {
        enabled: false,
        primary: {
            ear: Ear.Both,
            frequency: 0,
            volume: 50,
        },
        secondary: {
            ear: Ear.Both,
            frequency: 0,
            volume: 50,
        },
    } as Radio,
    reducers: {
        enable(state, enabled: boolean) {
            return { ...state, enabled };
        },
        updatePrimary(state, channel: Partial<RadioChannel>) {
            return { ...state, primary: { ...state.primary, ...channel } };
        },
        updateSecondary(state, channel: Partial<RadioChannel>) {
            return { ...state, secondary: { ...state.secondary, ...channel } };
        },
    },
    effects: () => ({}),
});

export const radioLongRange = createModel<RootModel>()({
    state: {
        enabled: false,
        primary: {
            ear: Ear.Both,
            frequency: 0,
            volume: 50,
        },
        secondary: {
            ear: Ear.Both,
            frequency: 0,
            volume: 50,
        },
    } as Radio,
    reducers: {
        enable(state, enabled: boolean) {
            return { ...state, enabled };
        },
        updatePrimary(state, channel: Partial<RadioChannel>) {
            return { ...state, primary: { ...state.primary, ...channel } };
        },
        updateSecondary(state, channel: Partial<RadioChannel>) {
            return { ...state, secondary: { ...state.secondary, ...channel } };
        },
    },
    effects: () => ({}),
});
