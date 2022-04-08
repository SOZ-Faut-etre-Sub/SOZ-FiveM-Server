import {useNuiEvent} from 'fivem-nui-react-lib';
import {useMessageActions} from "./useMessageActions";
import {TwitchNewsEvents} from "@typings/twitch-news";

export const useTwitchNewsService = () => {
    const {updateLocalMessages} = useMessageActions();

    const handleMessageBroadcast = ({id, type, reporter, image, message, createdAt}) => {
        updateLocalMessages({id, type, reporter, image, message, createdAt});
    };

    useNuiEvent('TWITCH_NEWS', TwitchNewsEvents.CREATE_NEWS_BROADCAST, handleMessageBroadcast);
};
