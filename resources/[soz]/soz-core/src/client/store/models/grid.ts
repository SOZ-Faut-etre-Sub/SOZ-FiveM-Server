import { createModel } from '@rematch/core';

import type { RootModel } from './';

export const grid = createModel<RootModel>()({
    state: [] as number[],
    reducers: {
        set(state, chunks: number[]) {
            return chunks;
        },
    },
    effects: () => ({}),
});
