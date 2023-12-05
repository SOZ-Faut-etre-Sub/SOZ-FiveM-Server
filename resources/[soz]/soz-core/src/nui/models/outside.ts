import { createModel } from '@rematch/core';

import type { RootModel } from './';

export const outside = createModel<RootModel>()({
    state: {} as Record<string, HTMLElement>,
    reducers: {
        add(state, name: string, ref: HTMLElement) {
            return { ...state, [name]: ref };
        },
        remove(state, name: string) {
            const newState = { ...state };
            delete newState[name];
            return newState;
        },
    },
    effects: () => ({}),
});
