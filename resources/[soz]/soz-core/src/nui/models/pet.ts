import { PetStats } from '@public/shared/nui/pet_manager';
import { createModel } from '@rematch/core';

import type { RootModel } from './';

export const petStats = createModel<RootModel>()({
    state: null,
    reducers: {
        update(state, stats: Partial<PetStats> | null) {
            if (stats === null) return null;
            if (state === null) return stats;
            return { ...state, ...stats };
        },
    },
    effects: () => ({}),
});
