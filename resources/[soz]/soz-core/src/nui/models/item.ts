import { createModel } from '@rematch/core';

import { Item } from '../../shared/item';
import type { RootModel } from './';

export const item = createModel<RootModel>()({
    state: [] as Item[],
    reducers: {
        set(state, items: Item[]) {
            return [...items];
        },
    },
    effects: () => ({}),
});
