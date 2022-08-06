import { Models } from '@rematch/core';

import { appBank } from './app/bank';
import { appNotes } from './app/notes';
import { appSociety } from './app/society';
import { appTwitchNews } from './app/twitchNews';
import { phone } from './phone';
import { simCard } from './simCard';

export interface RootModel extends Models<RootModel> {
    // Core models
    phone: typeof phone;
    simCard: typeof simCard;

    // Apps models
    appBank: typeof appBank;
    appNotes: typeof appNotes;
    appTwitchNews: typeof appTwitchNews;
    appSociety: typeof appSociety;
}

export const models: RootModel = { phone, simCard, appBank, appNotes, appTwitchNews, appSociety };
