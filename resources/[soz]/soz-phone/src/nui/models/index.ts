import { Models } from '@rematch/core';

import { appBank } from './app/bank';
import { appNotes } from './app/notes';
import { appSociety } from './app/society';
import { appTwitchNews } from './app/twitchNews';
import { time } from './os/time';
import { visibility } from './os/visibility';
import { phone } from './phone';
import { photo } from './photo';
import { simCard } from './simCard';

export interface RootModel extends Models<RootModel> {
    // Core models
    phone: typeof phone;
    time: typeof time;
    visibility: typeof visibility;

    // System models
    simCard: typeof simCard;
    photo: typeof photo;

    // Apps models
    appBank: typeof appBank;
    appNotes: typeof appNotes;
    appTwitchNews: typeof appTwitchNews;
    appSociety: typeof appSociety;
}

export const models: RootModel = {
    phone,
    time,
    visibility,
    simCard,
    photo,
    appBank,
    appNotes,
    appTwitchNews,
    appSociety,
};
