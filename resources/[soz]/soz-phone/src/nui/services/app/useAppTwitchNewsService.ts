import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { TwitchNewsEvents, TwitchNewsMessage } from '@typings/twitch-news';
import { useEffect } from 'react';

import { ServerPromiseResp } from '../../../../typings/common';
import { MockTwitchNewsMessages } from '../../apps/twitch-news/utils/constants';
import { store } from '../../store';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';

export const useAppTwitchNewsService = () => {
    useEffect(() => {
        fetchNui<ServerPromiseResp<TwitchNewsMessage[]>>(
            TwitchNewsEvents.FETCH_NEWS,
            undefined,
            buildRespObj(MockTwitchNewsMessages)
        ).then(news => {
            store.dispatch.appTwitchNews.setNews(news.data.reverse());
        });
    }, []);

    useNuiEvent('TWITCH_NEWS', TwitchNewsEvents.CREATE_NEWS_BROADCAST, store.dispatch.appTwitchNews.appendNews);
};
