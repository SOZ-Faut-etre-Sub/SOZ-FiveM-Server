import { createModel } from '@rematch/core';

import { TwitchNewsMessage } from '../../../../typings/twitch-news';
import { RootModel } from '..';

export const appTwitchNews = createModel<RootModel>()({
    state: [] as TwitchNewsMessage[],
    reducers: {
        set: (state, payload) => {
            return [...payload];
        },
        add: (state, payload) => {
            return [payload, ...state];
        },
    },
    effects: dispatch => ({
        async setNews(payload: TwitchNewsMessage[]) {
            dispatch.appTwitchNews.set(payload);
        },
        async appendNews(payload: TwitchNewsMessage) {
            dispatch.appTwitchNews.add(payload);
        },
    }),
});
