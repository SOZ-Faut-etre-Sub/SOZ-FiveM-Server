import { PlayerStats } from '@public/shared/nui/player';
import { Vector3 } from '@public/shared/polyzone/vector';
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

export const playerStats = createModel<RootModel>()({
    state: {
        health: 200,
        armor: 100,
        stamina: 100,
        armorPlates: 0,
    } as PlayerStats,
    reducers: {
        update(state, stats: Partial<PlayerStats>) {
            return { ...state, ...stats };
        },
    },
    effects: () => ({}),
});

export const playerPosition = createModel<RootModel>()({
    state: [0, 0, 0] as Vector3,
    reducers: {
        update(state, position: Vector3) {
            return position;
        },
    },
    effects: () => ({}),
});
