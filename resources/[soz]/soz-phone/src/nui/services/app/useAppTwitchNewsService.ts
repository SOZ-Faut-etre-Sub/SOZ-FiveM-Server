import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { TwitchNewsEvents, TwitchNewsMessage } from '@typings/twitch-news';
import { useEffect } from 'react';
import { store } from '../../store';
import { useTwitchNewsNotifications } from '../../apps/twitch-news/hooks/useTwitchNewsNotifications';


export const useAppTwitchNewsService = () => {
    const { setNotification } = useTwitchNewsNotifications();

    useEffect(() => {
        store.dispatch.appTwitchNews.loadNews();
    }, []);

    const handleMessageBroadcast = (message: TwitchNewsMessage) => {
        store.dispatch.appTwitchNews.appendNews(message);
        setNotification({ message: message.message });
    };

    useNuiEvent('TWITCH_NEWS', TwitchNewsEvents.CREATE_NEWS_BROADCAST, handleMessageBroadcast);
    useNuiEvent('TWITCH_NEWS', TwitchNewsEvents.RELOAD_NEWS, store.dispatch.appTwitchNews.loadNews);
};
