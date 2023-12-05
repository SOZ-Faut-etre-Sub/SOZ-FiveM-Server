import { createModel } from '@rematch/core';

import { HudState } from '../../shared/hud';
import type { RootModel } from './';

export const hud = createModel<RootModel>()({
    state: {
        voiceMode: 0,
        minimap: {
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
    },
    effects: () => ({}),
});
