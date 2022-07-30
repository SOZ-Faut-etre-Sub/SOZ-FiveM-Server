import { Models } from '@rematch/core';

import { appBank } from './app/bank';
import { appTwitchNews } from './app/twitchNews';
import { phone } from './phone';

export interface RootModel extends Models<RootModel> {
    // Core models
    phone: typeof phone;
    // Apps models
    appBank: typeof appBank;
    appTwitchNews: typeof appTwitchNews;
}

export const models: RootModel = { phone, appBank, appTwitchNews };
