import { Models } from '@rematch/core';

import { global } from './global';
import { radioLongRange, radioShortRange } from './radio';

export interface RootModel extends Models<RootModel> {
    global: typeof global;
    radioShortRange: typeof radioShortRange;
    radioLongRange: typeof radioLongRange;
}

export const models: RootModel = {
    global,
    radioShortRange,
    radioLongRange,
};
