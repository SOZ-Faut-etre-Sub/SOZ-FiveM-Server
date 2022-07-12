import { Models } from '@rematch/core';

import { phone } from './phone';

export interface RootModel extends Models<RootModel> {
    phone: typeof phone;
}
export const models: RootModel = { phone };
