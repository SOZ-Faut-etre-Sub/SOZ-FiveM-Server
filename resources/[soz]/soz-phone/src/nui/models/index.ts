import { Models } from '@rematch/core';

import { appBank } from './app/bank';
import { phone } from './phone';

export interface RootModel extends Models<RootModel> {
    // Core models
    phone: typeof phone;
    // Apps models
    appBank: typeof appBank;
}

export const models: RootModel = { phone, appBank };
