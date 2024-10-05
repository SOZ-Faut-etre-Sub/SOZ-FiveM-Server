import { createModel } from '@rematch/core';

import { Feature } from '../../shared/features';
import { RootModel } from '.';

export const features = createModel<RootModel>()({
    state: {} as Record<Feature, boolean>,
    reducers: {
        set: (state, feature: Record<Feature, boolean>) => {
            return { ...state, ...feature };
        },
    },
    effects: () => ({}),
});
