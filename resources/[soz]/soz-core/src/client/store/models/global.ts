import { createModel } from '@rematch/core';

import { BLACK_SCREEN_URL, GlobalState } from '../../../shared/global';
import { JobType } from '../../../shared/job';
import type { RootModel } from './';

export const global = createModel<RootModel>()({
    state: {
        disableAFK: false,
        blackout: false,
        blackoutLevel: 0,
        blackoutOverride: false,
        jobEnergy: {
            [JobType.Adsl]: 100,
            [JobType.Baun]: 100,
            [JobType.BCSO]: 100,
            [JobType.Bennys]: 100,
            [JobType.CashTransfer]: 100,
            [JobType.Delivery]: 100,
            [JobType.FBI]: 100,
            [JobType.Ffs]: 100,
            [JobType.Food]: 100,
            [JobType.Garbage]: 100,
            [JobType.LSMC]: 100,
            [JobType.LSPD]: 100,
            [JobType.MDR]: 100,
            [JobType.News]: 100,
            [JobType.YouNews]: 100,
            [JobType.Oil]: 100,
            [JobType.Pawl]: 100,
            [JobType.Religious]: 100,
            [JobType.Scrapper]: 100,
            [JobType.Taxi]: 100,
            [JobType.Unemployed]: 100,
            [JobType.Upw]: 100,
            [JobType.FDF]: 100,
            [JobType.SASP]: 100,
            [JobType.Gouv]: 100,
            [JobType.DMC]: 100,
        },
        weather: 'CLEAR',
        snow: false,
        streamUrls: {
            bennys: BLACK_SCREEN_URL,
        },
    } as GlobalState,
    reducers: {
        set(state, global: GlobalState) {
            return { ...state, ...global };
        },
    },
    effects: () => ({}),
});
