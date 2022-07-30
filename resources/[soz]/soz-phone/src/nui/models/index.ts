import { Models } from '@rematch/core';

import { appBank } from './app/bank';
import { appTwitchNews } from './app/twitchNews';
import { phone } from './phone';
import { simCard } from './simCard';

export interface RootModel extends Models<RootModel> {
    // Core models
    phone: typeof phone;
    simCard: typeof simCard;

    // Apps models
    appBank: typeof appBank;
    appTwitchNews: typeof appTwitchNews;
}

export const models: RootModel = { phone, simCard, appBank, appTwitchNews };
