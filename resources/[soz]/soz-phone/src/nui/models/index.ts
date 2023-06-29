import { Models } from '@rematch/core';

import { api } from './api';
import { appBank } from './app/bank';
import { appInvoices } from './app/invoices';
import { appNotes } from './app/notes';
import { appSociety } from './app/society';
import { appBankTransfersList } from './app/transfersList';
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
    api: typeof api;

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
    appBankTransfersList: typeof appBankTransfersList;
    appSociety: typeof appSociety;
}

export const models: RootModel = {
    phone,
    time,
    visibility,
    api,
    simCard,
    avatar,
    photo,
    appBank,
    appNotes,
    appInvoices,
    appTwitchNews,
    appBankTransfersList,
    appSociety,
    emergency,
};
