import { Models } from '@rematch/core';

import { appBank } from './app/bank';
import { appNotes } from './app/notes';
import { appInvoices } from './app/invoices';
import { appSociety } from './app/society';
import { appTwitchNews } from './app/twitchNews';
import { emergency } from './emergency';
import { time } from './os/time';
import { visibility } from './os/visibility';
import { phone } from './phone';
import { photo } from './photo';
import { avatar } from './sim/avatar';
import { simCard } from './simCard';

export interface RootModel extends Models<RootModel> {
    // Core models
    phone: typeof phone;
    time: typeof time;
    visibility: typeof visibility;

    // System models
    simCard: typeof simCard;
    avatar: typeof avatar;
    photo: typeof photo;
    emergency: typeof emergency;

    // Apps models
    appBank: typeof appBank;
    appNotes: typeof appNotes;
    appInvoices: typeof appInvoices;
    appTwitchNews: typeof appTwitchNews;
    appSociety: typeof appSociety;
}

export const models: RootModel = {
    phone,
    time,
    visibility,
    simCard,
    avatar,
    photo,
    appBank,
    appNotes,
    appInvoices,
    appTwitchNews,
    appSociety,
    emergency,
};
