import { Models } from '@rematch/core';

import { api } from './api';
import { appBank } from './app/bank';
import { appInvoices } from './app/invoices';
import { appNotes } from './app/notes';
import { appSnake } from './app/snake';
import { appSociety } from './app/society';
import { appTetrisLeaderboard } from './app/tetrisLeaderboard';
import { appTwitchNews } from './app/twitchNews';
import { appWeather } from './app/weather';
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
    appSociety: typeof appSociety;
    appWeather: typeof appWeather;
    appTetrisLeaderboard: typeof appTetrisLeaderboard;
    appSnake: typeof appSnake;
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
    appSociety,
    appWeather,
    emergency,
    appTetrisLeaderboard,
    appSnake,
};
