import { createModel } from '@rematch/core';

import { ServerPromiseResp } from '../../../../typings/common';
import { TwitchNewsEvents, TwitchNewsMessage } from '../../../../typings/twitch-news';
import { MockTwitchNewsMessages } from '../../apps/twitch-news/utils/constants';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';
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
        // loader
        async loadNews() {
            fetchNui<ServerPromiseResp<TwitchNewsMessage[]>>(
                TwitchNewsEvents.FETCH_NEWS,
                undefined,
                buildRespObj(MockTwitchNewsMessages)
            )
                .then(news => {
                    dispatch.appTwitchNews.set(news.data.reverse() || []);
                })
                .catch(() => console.log('Failed to load news'));
        },
    }),
});
