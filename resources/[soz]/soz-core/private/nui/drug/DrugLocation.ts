import { createModel } from '@rematch/core';

import { RootModel } from '../../../src/nui/models';
import { DrugNuiZone } from '../../shared/drugs';

export const drugLocation = createModel<RootModel>()({
    state: [] as DrugNuiZone[],
    reducers: {
        setZones(state, any) {
            return state;
        },
        addUpdateZone(state, any) {
            return state;
        },
        removeZone(state, any) {
            return state;
        },
    },
    effects: () => ({}),
});
