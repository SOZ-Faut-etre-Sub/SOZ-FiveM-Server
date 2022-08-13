import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { TwitchNewsEvents } from '@typings/twitch-news';
import { useEffect } from 'react';

import { store } from '../../store';

export const useAppTwitchNewsService = () => {
    useEffect(() => {
        store.dispatch.appTwitchNews.loadNews();
    }, []);

    useNuiEvent('TWITCH_NEWS', TwitchNewsEvents.CREATE_NEWS_BROADCAST, store.dispatch.appTwitchNews.appendNews);
};
