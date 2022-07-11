import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { TwitchNewsEvents } from '@typings/twitch-news';

import { useMessageActions } from './useMessageActions';

export const useTwitchNewsService = () => {
    const { updateLocalMessages } = useMessageActions();

    const handleMessageBroadcast = ({ id, type, reporter, reporterId, image, message, createdAt }) => {
        updateLocalMessages({ id, type, reporter, reporterId, image, message, createdAt });
    };

    useNuiEvent('TWITCH_NEWS', TwitchNewsEvents.CREATE_NEWS_BROADCAST, handleMessageBroadcast);
};
