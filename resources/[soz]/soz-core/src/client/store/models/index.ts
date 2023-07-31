import { Models } from '@rematch/core';

import { global } from './global';
import { grid } from './grid';
import { radioLongRange, radioShortRange } from './radio';

export interface RootModel extends Models<RootModel> {
    global: typeof global;
    grid: typeof grid;
    radioShortRange: typeof radioShortRange;
    radioLongRange: typeof radioLongRange;
}

export const models: RootModel = {
    global,
    grid,
    radioShortRange,
    radioLongRange,
};
