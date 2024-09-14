import { createModel } from '@rematch/core';

import { HudSettings, HudState } from '../../shared/hud';
import type { RootModel } from './';

export const hud = createModel<RootModel>()({
    state: {
        hasWatch: false,
        settings: {
            theme: 'auto',
            zoom: 1,
            showDateTime: false,
            showWeather: false,
            showStreetName: false,
            showCompass: false,
            showStress: false,
            showStamina: false,
        },

        voiceMode: 0,
        streetName: [],
        compass: {
            degree: 0,
            cardinal: 'N',
        },
        ammo: {
            hasWeapon: false,
            ammo: 0,
            maxAmmo: 0,
        },
        dateTime: {
            dayOfWeek: 0,
            hour: 0,
            minute: 0,
        },
        minimap: {
            isHidden: true,
            X: 0.08091666683321,
            Y: 0.88549252311906,
            bottom: 0.97361377796573,
            height: 0.17624250969333,
            left: 0.01560416735708,
            right: 0.15122916630934,
            top: 0.79737126827239,
            width: 0.14062499895226,
        },
    } as HudState,
    reducers: {
        update(state, hud: Partial<HudState>) {
            return { ...state, ...hud };
        },
        updateSettings(state, hud: Partial<HudSettings>) {
            return { ...state, settings: { ...state.settings, ...hud } };
        },
    },
    effects: () => ({}),
});
