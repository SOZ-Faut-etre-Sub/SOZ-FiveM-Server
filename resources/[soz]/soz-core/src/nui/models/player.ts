import { createModel } from '@rematch/core';

import { PlayerData } from '../../shared/player';
import type { RootModel } from './';

export const player = createModel<RootModel>()({
    state: null as PlayerData | null,
    reducers: {
        update(state, player: Partial<PlayerData>) {
            return { ...state, ...player };
        },
    },
    effects: () => ({}),
});

export const playerHealth = createModel<RootModel>()({
    state: 200,
    reducers: {
        update(state, health: number) {
            return health;
        },
    },
    effects: () => ({}),
});
